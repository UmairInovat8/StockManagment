import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async calculateVariance(auditId: string) {
        // @ts-ignore
        const baselines = await this.prisma.auditSohBaseline.findMany({
            where: { auditId },
            include: { item: true },
        });

        const variances: any[] = [];
        for (const baseline of baselines) {
            // @ts-ignore
            const counts = await this.prisma.sectionItemTotal.aggregate({
                where: {
                    // @ts-ignore
                    section: { auditId },
                    itemId: baseline.itemId,
                },
                _sum: { total: true },
            });

            const countedQuantity = counts._sum.total || 0;
            const variance = countedQuantity - baseline.quantity;

            // @ts-ignore
            const record = await this.prisma.varianceTotal.upsert({
                where: { auditId_itemId: { auditId, itemId: baseline.itemId } },
                update: { sohQuantity: baseline.quantity, countedQuantity, variance },
                create: {
                    auditId,
                    itemId: baseline.itemId,
                    sohQuantity: baseline.quantity,
                    countedQuantity,
                    variance,
                },
            });
            variances.push({ ...record, item: baseline.item });
        }
        return variances;
    }

    async exportVarianceCsv(auditId: string) {
        const data = await this.calculateVariance(auditId);
        // basic CSV formatter
        const header = 'SKU,Name,SOH,Counted,Variance\n';
        const rows = data.map(v => `${v.item.sku},"${v.item.name}",${v.sohQuantity},${v.countedQuantity},${v.variance}`).join('\n');
        return header + rows;
    }
}
