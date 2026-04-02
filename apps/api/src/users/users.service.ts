import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string, isGlobal: boolean = false) {
        const where: any = isGlobal ? {} : { tenantId };
        
        return this.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                tenant: { select: { companyName: true } },
                roles: { select: { role: { select: { name: true } } } },
                branchAccess: { select: { branch: { select: { id: true, branchName: true } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getRoles(tenantId: string) {
        console.log('[DEBUG] UsersService.getRoles called for tenantId:', tenantId);
        
        const defaults = ['Admin', 'AuditManager', 'Auditor', 'Counter'];
        
        // Ensure each default role exists for the tenant
        await Promise.all(defaults.map(name => 
            this.prisma.role.upsert({
                where: { name_tenantId: { name, tenantId } },
                update: {},
                create: { name, tenantId }
            })
        ));

        const roles = await this.prisma.role.findMany({
            where: { tenantId }
        });
        
        console.log('[DEBUG] Final roles list for tenant:', roles.length);
        return roles;
    }

    async create(tenantId: string, data: any) {
        const { email, password, firstName, lastName, roleId, branchIds } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.$transaction(async (tx) => {
            // @ts-ignore
            const user = await tx.user.create({
                data: {
                    email: email.toLowerCase(),
                    password: hashedPassword,
                    firstName,
                    lastName,
                    tenantId,
                    roles: {
                        create: {
                            roleId: roleId
                        }
                    },
                    branchAccess: {
                        create: (branchIds || []).map(id => ({
                            branchId: id
                        }))
                    }
                },
                include: {
                    roles: { include: { role: true } },
                    branchAccess: { include: { branch: true } }
                }
            });
            return user;
        });
    }
}
