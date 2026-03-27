// @ts-nocheck
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
    constructor(private prisma: PrismaService) { }

    async processCountEvents(tenantId: string, events: any[]) {
        console.log(`[SyncService] High-Performance Sync: Processing ${events.length} events for tenant ${tenantId}`);
        
        // 1. Resolve SKUs in Bulk
        const skusToResolve = events
            .filter(e => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.itemId))
            .map(e => e.itemId);
        
        const skuMap = new Map<string, string>();
        if (skusToResolve.length > 0) {
            const resolvedItems = await this.prisma.item.findMany({
                where: { skuCode: { in: skusToResolve }, tenantId, deletedAt: null },
                select: { id: true, skuCode: true }
            });
            resolvedItems.forEach(item => skuMap.set(item.skuCode, item.id));
        }

        // 2. Filter and Prepare Events
        const validEvents = events.map(event => {
            const internalItemId = skuMap.get(event.itemId) || event.itemId;
            return {
                clientEventId: event.client_event_id || event.clientEventId,
                tenantId,
                sectionId: event.sectionId,
                itemId: internalItemId,
                userId: event.userId,
                quantity: Number(event.quantity),
                scannedAt: new Date(event.scannedAt),
                metadata: event.metadata || {},
            };
        }).filter(e => {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(e.itemId);
            if (!isUuid) console.warn(`[SyncService] Skipping event ${e.clientEventId}: Item ID not resolvable.`);
            return isUuid;
        });

        // 3. Batch Create Events
        const results = [];
        for (const data of validEvents) {
            try {
                const upsertParams: any = {
                    where: { clientEventId: data.clientEventId },
                    update: {},
                    create: data
                };
                const res = await (this.prisma.countEvent as any)['upsert'](upsertParams);
                results.push(res);
            } catch (e) {
                console.error(`[SyncService] Upsert error for ${data.clientEventId}:`, e);
            }
        }

        // 4. Deferred Total Calculation (Bulk)
        const uniqueKeys = Array.from(new Set(validEvents.map(e => `${e.sectionId}|${e.itemId}`)));
        console.log(`[SyncService] Recalculating totals for ${uniqueKeys.length} section-item pairs...`);
        
        await Promise.all(uniqueKeys.map(async (key) => {
            const [sectionId, itemId] = key.split('|');
            await this.updateSectionTotal(sectionId, itemId);
        }));

        return results;
    }

    private async updateSectionTotal(sectionId: string, itemId: string) {
        // @ts-ignore
        const sum = await this.prisma.countEvent.aggregate({
            where: { sectionId, itemId, deletedAt: null },
            _sum: { quantity: true },
        });

        const total = sum._sum.quantity || 0;

        // @ts-ignore
        await this.prisma.sectionItemTotal.upsert({
            where: { sectionId_itemId: { sectionId, itemId } },
            update: { total },
            create: { sectionId, itemId, total },
        });
    }

    async lockSection(sectionId: string, userId: string, reason?: string) {
        // @ts-ignore
        return this.prisma.auditSection.update({
            where: { id: sectionId },
            data: {
                status: 'LOCKED', // Enum string works for Prisma if named correctly
                lockedBy: userId,
                lockReason: reason,
            },
        });
    }
}
