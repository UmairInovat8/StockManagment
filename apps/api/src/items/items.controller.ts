import { Controller, Get, Post, Body, Query, UseInterceptors, UploadedFile, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemsService } from './items.service';
import * as Papa from 'papaparse';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @Get()
    async findAll(@Request() req: any, @Query('skip') skip: number, @Query('take') take: number) {
        return this.itemsService.findAll(req.user.tenantId, +skip || 0, +take || 50);
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importCsv(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const csvData = file.buffer.toString();
        const parsed = Papa.parse(csvData, { header: true });

        // items expected: { sku, name, barcode }
        await this.itemsService.bulkSync(req.user.tenantId, parsed.data);
        return { message: 'Import started', count: parsed.data.length };
    }

    @Post()
    async create(@Body() createDto: any, @Request() req: any) {
        return this.itemsService.create({
            ...createDto,
            tenantId: req.user.tenantId,
        });
    }
}
