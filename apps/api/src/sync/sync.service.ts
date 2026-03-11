import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
    constructor(private prisma: PrismaService) { }

    async processCountEvents(tenantId: string, events: any[]) {
        const results: any[] = [];
        for (const event of events) {
            try {
                // @ts-ignore
                const result = await this.prisma.countEvent.upsert({
                    where: { client_event_id: event.client_event_id },
                    update: {}, // Idempotent: do nothing if exists
                    create: {
                        client_event_id: event.client_event_id,
                        tenantId,
                        sectionId: event.sectionId,
                        itemId: event.itemId,
                        userId: event.userId,
                        quantity: event.quantity,
                        scannedAt: new Date(event.scannedAt),
                        metadata: event.metadata || {},
                    },
                });
                results.push(result);

                // Update section totals (incremental update in real scenarios, or recompute)
                await this.updateSectionTotal(event.sectionId, event.itemId);
            } catch (e) {
                console.error(`Sync error for event ${event.client_event_id}:`, e);
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
