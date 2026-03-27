import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService) { }

    async findTree(branchId: string) {
        // Basic implementation: fetch all and build tree or just fetch hierarchy
        // @ts-ignore
        return this.prisma.location.findMany({
            where: { branchId, parentId: null },
            include: {
                children: {
                    include: {
                        children: true, // Supporting 3 levels for now, can be recursive in FE
                    },
                },
            },
        });
    }

    async create(data: any) {
        // @ts-ignore
        return this.prisma.location.create({ data });
    }

    async findByQr(branchId: string, qrValue: string) {
        // @ts-ignore
        return this.prisma.location.findFirst({
            where: { branchId, qrValue },
        });
    }

    async bulkSync(tenantId: string, items: any[]) {
        // Fetch all branches for the tenant to validate the Warehouse column
        const branches = await this.prisma.branch.findMany({
            where: { tenantId }
        });
        const branchMap = new Map(branches.map(b => [b.branchCode.toLowerCase(), b.id]));

        for (const rawItem of items) {
            const getValue = (keys: string[]) => {
                const rawKeys = Object.keys(rawItem);
                for (const key of keys) {
                    const exactMatch = rawItem[key];
                    if (exactMatch !== undefined && exactMatch !== null && exactMatch !== '#N/A' && exactMatch !== '') return exactMatch;
                    
                    const lowerKey = key.toLowerCase();
                    const foundKey = rawKeys.find(k => k.toLowerCase() === lowerKey);
                    if (foundKey) {
                        const val = rawItem[foundKey];
                        if (val !== undefined && val !== null && val !== '#N/A' && val !== '') return val;
                    }
                }
                return undefined;
            };

            const warehouse = getValue(['Warehouse', 'Branch', 'Store']);
            const code = getValue(['Location', 'Location ID', 'Bin', 'Shelf']);
            const zone = getValue(['Zone', 'Area']);
            const sequenceStr = getValue(['Sequence', 'Count sequence', 'Order']);

            if (!warehouse || !code) continue;

            const branchId = branchMap.get(warehouse.toLowerCase());
            if (!branchId) {
                console.warn(`Branch with code ${warehouse} not found. Skipping location ${code}`);
                continue;
            }

            const metadata = {
                ...(zone ? { zone } : {}),
                ...(sequenceStr ? { sequence: parseInt(sequenceStr, 10) || sequenceStr } : {})
            };

            await this.prisma.location.upsert({
                where: { branchId_code: { branchId, code: code } },
                update: {
                    qrValue: code,
                    metadata
                },
                create: {
                    branchId,
                    code: code,
                    qrValue: code,
                    metadata
                }
            });
        }
    }
}
