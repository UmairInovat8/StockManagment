import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('brands')
@UseGuards(JwtAuthGuard)
export class BrandsController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.prisma.brand.findMany({
            where: { tenantId: req.user.tenantId },
            include: { _count: { select: { branches: true } } },
            orderBy: { name: 'asc' },
        });
    }

    @Post()
    async create(@Body() body: any, @Request() req: any) {
        return this.prisma.brand.create({
            data: { name: body.name, tenantId: req.user.tenantId },
        });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.prisma.brand.update({ where: { id }, data: { name: body.name } });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.prisma.brand.delete({ where: { id } });
    }
}
