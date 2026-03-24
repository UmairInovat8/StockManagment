import { Controller, Get, Post, Body, Param, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Papa from 'papaparse';
import { LocationsService } from './locations.service';

@Controller('locations')
export class LocationsController {
    constructor(private locationsService: LocationsService) { }

    @Get('tree')
    async getTree(@Request() req: any) {
        const branchId = req.query.branchId;
        // Simple UUID v4 check (8-4-4-4-12 hex chars)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!branchId || !uuidRegex.test(branchId)) {
            return [];
        }
        return this.locationsService.findTree(branchId);
    }

    @Post()
    async create(@Body() createDto: any) {
        return this.locationsService.create(createDto);
    }

    @Post('import')
    @UseInterceptors(FileInterceptor('file'))
    async importCsv(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const csvString = file.buffer.toString();
        const lines = csvString.split(/\r?\n/);
        
        // Find the actual header row
        let headerIndex = 0;
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            if (lines[i].toLowerCase().includes('warehouse') || lines[i].toLowerCase().includes('location')) {
                headerIndex = i;
                break;
            }
        }
        
        const dataToParse = lines.slice(headerIndex).join('\n');

        const parsed = Papa.parse(dataToParse, { 
            header: true, 
            skipEmptyLines: true,
            transformHeader: (header) => header.trim()
        });

        await this.locationsService.bulkSync(req.user.tenantId, parsed.data);
        return { message: 'Locations import started', count: parsed.data.length };
    }
}
