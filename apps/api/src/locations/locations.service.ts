import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
    constructor(private prisma: PrismaService) { }

    async findTree(branchId: string) {
        // Basic implementation: fetch all and build tree or just fetch hierarchy
        // @ts-ignore
        return this.prisma.location.findMany({
            where: { branchId, parent_id: null },
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
}
