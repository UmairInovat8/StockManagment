import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
    constructor(private prisma: PrismaService) { }

    async processCountEvents(tenantId: string, events: any[]) {
        console.log(`[SyncService] Processing ${events.length} events for tenant ${tenantId}`);
        const results: any[] = [];
        for (const event of events) {
            try {
                console.log(`[SyncService] Processing event: ${event.client_event_id}, Item: ${event.itemId}`);
                // Resolve SKU to Item UUID if needed
                let internalItemId = event.itemId;
                const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                
                if (!uuidRegex.test(internalItemId)) {
                    console.log(`[SyncService] Resolving SKU: ${event.itemId}`);
                    const item = await this.prisma.item.findFirst({
                        where: { sku_code: event.itemId, tenantId }
                    });
                    if (item) {
                        internalItemId = item.id;
                        console.log(`[SyncService] Resolved SKU ${event.itemId} to ID ${internalItemId}`);
                    } else {
                        console.warn(`[SyncService] Item with SKU ${event.itemId} not found in tenant ${tenantId}. Skipping.`);
                        continue;
                    }
                }
                
                console.log(`[SyncService] Upserting CountEvent: ${event.client_event_id}`);
                // @ts-ignore
                const result = await this.prisma.countEvent.upsert({
                    where: { client_event_id: event.client_event_id },
                    update: {}, // Idempotent: do nothing if exists
                    create: {
                        client_event_id: event.client_event_id,
                        tenantId,
                        sectionId: event.sectionId,
                        itemId: internalItemId,
                        userId: event.userId,
                        quantity: Number(event.quantity),
                        scannedAt: new Date(event.scannedAt),
                        metadata: event.metadata || {},
                    },
                });
                results.push(result);
                console.log(`[SyncService] Successfully saved event ${event.client_event_id}`);

                // Update section totals
                await this.updateSectionTotal(event.sectionId, internalItemId);
            } catch (e) {
                console.error(`[SyncService] Sync error for event ${event.client_event_id}:`, e);
            }
        }
        return results;
    }

    private async updateSectionTotal(sectionId: string, itemId: string) {
        // @ts-ignore
        const sum = await this.prisma.countEvent.aggregate({
            where: { sectionId, itemId },
            _sum: { quantity: true },
        });

        // @ts-ignore
        await this.prisma.sectionItemTotal.upsert({
            where: { sectionId_itemId: { sectionId, itemId } },
            update: { total: sum._sum.quantity || 0 },
            create: { sectionId, itemId, total: sum._sum.quantity || 0 },
        });
    }

    async lockSection(sectionId: string, userId: string, reason?: string) {
        // @ts-ignore
        return this.prisma.auditSection.update({
            where: { id: sectionId },
            data: {
                status: 'LOCKED',
                lockedBy: userId,
                lockReason: reason,
            },
        });
    }
}
