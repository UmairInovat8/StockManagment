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
        // @ts-ignore
        const user = await this.prisma.user.findUnique({
            where: { email },
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
        const { companyName, email, password, firstName, lastName } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        // 1. Create Tenant
        // @ts-ignore
        const tenant = await this.prisma.tenant.create({
            data: { name: companyName },
        });

        // 2. Ensure default role
        // @ts-ignore
        const role = await this.prisma.role.create({
            data: { name: 'AuditManager', tenantId: tenant.id }
        });

        // 3. Create User
        // @ts-ignore
        const user = await this.prisma.user.create({
            data: {
                email,
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
    }
}
