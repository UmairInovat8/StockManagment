import { Controller, Get, Post, Patch, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BranchesService } from './branches.service';

@Controller('branches')
@UseGuards(JwtAuthGuard)
export class BranchesController {
    constructor(private branchesService: BranchesService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.branchesService.findAll(req.user.tenantId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.branchesService.findOne(id, req.user.tenantId);
    }

    @Post()
    async create(@Body() createDto: any, @Request() req: any) {
        return this.branchesService.create({
            ...createDto,
            tenantId: req.user.tenantId,
        });
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateDto: any, @Request() req: any) {
        return this.branchesService.update(id, req.user.tenantId, updateDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string, @Request() req: any) {
        return this.branchesService.remove(id, req.user.tenantId);
    }
}
