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
            where: { tenantId: req.user.tenantId, deletedAt: null },
            include: { _count: { select: { branches: true } } },
            orderBy: { brandName: 'asc' },
        });
    }

    @Post()
    async create(@Body() body: any, @Request() req: any) {
        return this.prisma.brand.create({
            data: {
                brandName: body.brandName || body.brand_name || body.name,
                brandCode: body.brandCode || body.brand_code || body.code,
                tenantId: req.user.tenantId,
            },
        });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.prisma.brand.update({
            where: { id },
            data: {
                brandName: body.brandName || body.brand_name || body.name,
                brandCode: body.brandCode || body.brand_code || body.code,
            }
        });
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.prisma.brand.delete({ where: { id } });
    }
}
