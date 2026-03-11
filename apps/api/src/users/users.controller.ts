import { Controller, Get, Request } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('users')
export class UsersController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Request() req: any) {
        // @ts-ignore
        return this.prisma.user.findMany({
            where: { tenantId: req.user.tenantId },
            include: {
                roles: { include: { role: true } },
                branchAccess: { include: { branch: true } }
            }
        });
    }
}
