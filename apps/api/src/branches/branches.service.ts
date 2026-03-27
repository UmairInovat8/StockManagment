import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseFileToRows, getRowValue } from '../common/parse-file.util';

@Injectable()
export class BranchesService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.branch.findMany({
            where: { tenantId, deletedAt: null },
            include: { brand: { select: { id: true, brandName: true } } },
            orderBy: { branchName: 'asc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        return this.prisma.branch.findFirst({
            where: { id, tenantId },
        });
    }

    async create(data: any) {
        const brandId = data.brandId || data.brand_id;
        const tenantId = data.tenantId || data.tenant_id;
        const branchName = data.branchName || data.branch_name;
        const branchCode = data.branchCode || data.branch_code;
        const status = data.status;
        const poc = data.poc;
        const branchLocation = data.branchLocation || data.branch_location;
        const resourcesAssigned = data.resourcesAssigned || data.resources_assigned;
        const countersCount = data.countersCount || data.counters_count;
        const shelvesCount = data.shelvesCount || data.shelves_count;
        const gondolasCount = data.gondolasCount || data.gondolas_count;
        const areaManagerName = data.areaManagerName || data.area_manager_name;
        const businessEntityType = data.businessEntityType || data.business_entity_type;
        const invoiceTo = data.invoiceTo || data.invoice_to;
        let resolvedBrandId = brandId;
        if (!resolvedBrandId) {
            const defaultBrand = await this.prisma.brand.findFirst({ where: { tenantId } });
            if (!defaultBrand) throw new BadRequestException('No brand found. Please create a brand first.');
            resolvedBrandId = defaultBrand.id;
        }
        return this.prisma.branch.create({
            data: {
                branchName,
                branchCode,
                status: status || 'ACTIVE',
                poc,
                branchLocation,
                resourcesAssigned: resourcesAssigned ? parseInt(resourcesAssigned) : null,
                countersCount: countersCount ? parseInt(countersCount) : null,
                shelvesCount: shelvesCount ? parseInt(shelvesCount) : null,
                gondolasCount: gondolasCount ? parseInt(gondolasCount) : null,
                areaManagerName,
                businessEntityType,
                invoiceTo,
                brandId: resolvedBrandId,
                tenantId,
            },
        });
    }

    async update(id: string, tenantId: string, data: any) {
        const { branchName, branchCode, status, poc, branchLocation, resourcesAssigned, countersCount, shelvesCount, gondolasCount, areaManagerName, businessEntityType, invoiceTo } = data;
        return this.prisma.branch.update({
            where: { id },
            data: {
                branchName,
                branchCode,
                status,
                poc,
                branchLocation,
                resourcesAssigned: resourcesAssigned ? parseInt(resourcesAssigned) : undefined,
                countersCount: countersCount ? parseInt(countersCount) : undefined,
                shelvesCount: shelvesCount ? parseInt(shelvesCount) : undefined,
                gondolasCount: gondolasCount ? parseInt(gondolasCount) : undefined,
                areaManagerName,
                businessEntityType,
                invoiceTo,
            },
        });
    }

    async remove(id: string, tenantId: string) {
        return this.prisma.branch.delete({ where: { id } });
    }

    async importLocations(branchId: string, file: Express.Multer.File): Promise<{ imported: number; skipped: number }> {
        const rows = parseFileToRows(file);
        
        let imported = 0;
        let skipped = 0;

        for (const row of rows) {
            // Support both the full column name and common abbreviations
            const code = getRowValue(row, ['Location', 'location', 'LOCATION', 'loc_code']);
            if (!code) { skipped++; continue; }

            const name = getRowValue(row, ['Zone', 'zone', 'ZONE', 'Area', 'area']) || code;
            const qrValue = `QR-${code}`;
            const sequence = getRowValue(row, ['Count sequence', 'count_sequence', 'Sequence']);
            const countGroup = getRowValue(row, ['Count Group', 'count_group', 'CountGroup']);
            const locationType = 'SHELF'; // default — can be derived from Type column later

            const metadata: Record<string, any> = {};
            if (name) metadata.name = name;
            if (sequence) metadata.sequence = sequence;
            if (countGroup) metadata.countGroup = countGroup;

            try {
                await this.prisma.location.upsert({
                    where: { branchId_code: { branchId, code: code! } },
                    update: { metadata },
                    create: {
                        code: code!,
                        qrValue,
                        locationType: locationType as any,
                        metadata,
                        branchId,
                    },
                });
                imported++;
            } catch (e) {
                console.error(`DB upsert error for code ${code}:`, e);
                // Throw on the first DB error so the UI alerts immediately
                if (imported === 0) {
                    const { BadRequestException } = require('@nestjs/common');
                    throw new BadRequestException(`Database Insertion Error on code '${code}': ${e.message}`);
                }
                skipped++;
            }
        }

        return { imported, skipped };
    }
}
