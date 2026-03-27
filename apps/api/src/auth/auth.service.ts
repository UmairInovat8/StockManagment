import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '../generated/prisma-client';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async validateUser(email: string, pass: string): Promise<any> {
        const normalizedEmail = email.toLowerCase();
        // @ts-ignore
        const user = await this.prisma.user.findUnique({
            where: { email: normalizedEmail },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: any) {
        const payload = {
            email: user.email,
            sub: user.id,
            tenantId: user.tenantId,
            roles: user.roles.map(r => r.role.name)
        };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: payload.roles
            }
        };
    }

    async register(data: any) {
        const { companyName, companyCode, email, password, firstName, lastName } = data;
        const normalizedEmail = email.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.$transaction(async (tx) => {
            // 1. Create Tenant
            // @ts-ignore
            const tenant = await tx.tenant.create({
                data: { 
                    companyName: companyName, 
                    companyCode: companyCode || companyName.replace(/\s+/g, '-').toUpperCase().slice(0, 10) 
                },
            });

            // 2. Ensure default role
            // @ts-ignore
            const role = await tx.role.create({
                data: { name: 'AuditManager', tenantId: tenant.id }
            });

            // 3. Create Default Item Master
            // @ts-ignore
            await tx.itemMaster.create({
                data: { name: 'Default Master', tenantId: tenant.id }
            });

            // 4. Create User
            // @ts-ignore
            const user = await tx.user.create({
                data: {
                    email: normalizedEmail,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    tenantId: tenant.id,
                    roles: {
                        create: {
                            roleId: role.id
                        }
                    }
                },
                include: {
                    roles: {
                        include: {
                            role: true
                        }
                    }
                }
            });

            return this.login(user);
        });
    }
}
