import { Controller, Get, Post, Delete, Body, Query, UseInterceptors, UploadedFile, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemsService } from './items.service';
import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';


@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @Get()
    async findAll(
        @Request() req: any, 
        @Query('page') page: string, 
        @Query('limit') limit: string,
        @Query('search') search: string
    ) {
        return this.itemsService.findAll(req.user.tenantId, +page || 1, +limit || 20, search);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 50 * 1024 * 1024 } }))
    async uploadFile(@UploadedFile() file: any, @Request() req: any) {
        if (!file || !file.buffer) {
            throw new Error('No file uploaded or file is empty');
        }
        
        console.log(`Received file: ${file.originalname}, size: ${file.size} bytes`);
        
        // Background process the full sync
        this.itemsService.bulkSync(req.user.tenantId, file.buffer);
        
        return { 
            message: 'Progress synchronization initiated successfully.',
            detail: 'The catalog is being processed in the background.'
        };
    }

    @Post()
    async create(@Body() createDto: any, @Request() req: any) {
        return this.itemsService.create({
            ...createDto,
            tenantId: req.user.tenantId,
        });
    }

    @Get('import/status')
    async getImportStatus(@Request() req: any) {
        return this.itemsService.getImportStatus(req.user.tenantId);
    }

    @Post('delete-selected')
    async deleteMany(@Body('ids') ids: string[], @Request() req: any) {
        return this.itemsService.deleteMany(req.user.tenantId, ids);
    }

    @Delete('all')
    async deleteAll(@Request() req: any) {
        return this.itemsService.deleteAll(req.user.tenantId);
    }
}
