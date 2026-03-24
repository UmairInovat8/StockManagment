import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BranchesService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.branch.findMany({
            where: { tenantId },
            include: { brand: { select: { id: true, brand_name: true } } },
            orderBy: { branch_name: 'asc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        return this.prisma.branch.findFirst({
            where: { id, tenantId },
        });
    }

    async create(data: any) {
        const { brandId, tenantId, branch_name, branch_code, status, poc, branch_location, resources_assigned, counters_count, shelves_count, gondolas_count, area_manager_name, business_entity_type, invoice_to } = data;
        let resolvedBrandId = brandId;
        if (!resolvedBrandId) {
            const defaultBrand = await this.prisma.brand.findFirst({ where: { tenantId } });
            if (!defaultBrand) throw new BadRequestException('No brand found. Please create a brand first.');
            resolvedBrandId = defaultBrand.id;
        }
        return this.prisma.branch.create({
            data: {
                branch_name,
                branch_code,
                status: status || 'ACTIVE',
                poc,
                branch_location,
                resources_assigned: resources_assigned ? parseInt(resources_assigned) : null,
                counters_count: counters_count ? parseInt(counters_count) : null,
                shelves_count: shelves_count ? parseInt(shelves_count) : null,
                gondolas_count: gondolas_count ? parseInt(gondolas_count) : null,
                area_manager_name,
                business_entity_type,
                invoice_to,
                brandId: resolvedBrandId,
                tenantId,
            },
        });
    }

    async update(id: string, tenantId: string, data: any) {
        const { branch_name, branch_code, status, poc, branch_location, resources_assigned, counters_count, shelves_count, gondolas_count, area_manager_name, business_entity_type, invoice_to } = data;
        return this.prisma.branch.update({
            where: { id },
            data: {
                branch_name,
                branch_code,
                status,
                poc,
                branch_location,
                resources_assigned: resources_assigned ? parseInt(resources_assigned) : undefined,
                counters_count: counters_count ? parseInt(counters_count) : undefined,
                shelves_count: shelves_count ? parseInt(shelves_count) : undefined,
                gondolas_count: gondolas_count ? parseInt(gondolas_count) : undefined,
                area_manager_name,
                business_entity_type,
                invoice_to,
            },
        });
    }

    async remove(id: string, tenantId: string) {
        return this.prisma.branch.delete({ where: { id } });
    }
}
