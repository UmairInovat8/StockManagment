import { Controller, Get, Post, Body, Param, Request } from '@nestjs/common';
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
}
