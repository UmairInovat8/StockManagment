import { Controller, Get, Post, Delete, Body, Query, UseInterceptors, UploadedFile, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ItemsService } from './items.service';

@Controller('items')
@UseGuards(JwtAuthGuard)
export class ItemsController {
    constructor(private itemsService: ItemsService) { }

    @Get()
    async findAll(
        @Request() req: any, 
        @Query('itemMasterId') itemMasterId: string,
        @Query('page') page: string, 
        @Query('limit') limit: string,
        @Query('search') search: string
    ) {
        return this.itemsService.findAll(req.user.tenantId, itemMasterId, +page || 1, +limit || 20, search);
    }

    @Get('masters')
    async getMasters(@Request() req: any) {
        return this.itemsService.findAllMasters(req.user.tenantId);
    }

    @Post('masters')
    async createMaster(@Body('name') name: string, @Body('tenantId') brandId: string, @Request() req: any) {
        return this.itemsService.createMaster(req.user.tenantId, name, brandId);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 500 * 1024 * 1024 } }))
    async uploadFile(
        @UploadedFile() file: any, 
        @Body('itemMasterId') itemMasterId: string,
        @Request() req: any
    ) {
        if (!file || !file.buffer) throw new Error('No file uploaded');
        if (!itemMasterId) throw new Error('Item Master selection required');

        // FIX #6: File validation gate
        const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        const XLS_MIME = 'application/vnd.ms-excel';
        const MAX_XLSX_BYTES = 50 * 1024 * 1024; // 50MB
        if ((file.mimetype === XLSX_MIME || file.mimetype === XLS_MIME) && file.size > MAX_XLSX_BYTES) {
            throw new Error(`Excel files over 50MB are not supported (uploaded: ${(file.size / 1024 / 1024).toFixed(1)}MB). Please export your data as a CSV file and try again.`);
        }

        const job = await this.itemsService.bulkSync(req.user.tenantId, file.buffer, itemMasterId);
        
        return { 
            message: 'Sync started',
            jobId: job.id
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
    async deleteAll(@Query('itemMasterId') itemMasterId: string, @Request() req: any) {
        return this.itemsService.deleteAll(req.user.tenantId, itemMasterId);
    }
}
