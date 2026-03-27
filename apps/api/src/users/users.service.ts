import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.user.findMany({
            where: { tenantId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                roles: { select: { role: { select: { name: true } } } },
                branchAccess: { select: { branch: { select: { id: true, branchName: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
