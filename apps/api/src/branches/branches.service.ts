import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BranchesService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.branch.findMany({
            where: { tenantId },
            include: { brand: { select: { id: true, name: true } } },
            orderBy: { name: 'asc' },
        });
    }

    async findOne(id: string, tenantId: string) {
        return this.prisma.branch.findFirst({
            where: { id, tenantId },
        });
    }

    async create(data: any) {
        const { brandId, tenantId, name, code, status, poc, address, resources, counters, shelves, gondolas } = data;
        // If no brandId provided, use or create a default brand for this tenant
        let resolvedBrandId = brandId;
        if (!resolvedBrandId) {
            const defaultBrand = await this.prisma.brand.findFirst({ where: { tenantId } });
            if (!defaultBrand) throw new BadRequestException('No brand found. Please create a brand first.');
            resolvedBrandId = defaultBrand.id;
        }
        return this.prisma.branch.create({
            data: { name, code, status: status || 'Active', poc, address, resources: resources ? parseInt(resources) : null, counters: counters ? parseInt(counters) : null, shelves: shelves ? parseInt(shelves) : null, gondolas: gondolas ? parseInt(gondolas) : null, brandId: resolvedBrandId, tenantId },
        });
    }

    async update(id: string, tenantId: string, data: any) {
        const { name, code, status, poc, address, resources, counters, shelves, gondolas } = data;
        return this.prisma.branch.update({
            where: { id },
            data: { name, code, status, poc, address, resources: resources ? parseInt(resources) : undefined, counters: counters ? parseInt(counters) : undefined, shelves: shelves ? parseInt(shelves) : undefined, gondolas: gondolas ? parseInt(gondolas) : undefined },
        });
    }

    async remove(id: string, tenantId: string) {
        return this.prisma.branch.delete({ where: { id } });
    }
}
