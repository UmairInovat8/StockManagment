import { Controller, Get, Post, Patch, Body, Param, UploadedFile, UseInterceptors, Request, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuditsService } from './audits.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import * as Papa from 'papaparse';

@UseGuards(JwtAuthGuard)
@Controller('audits')
export class AuditsController {
    constructor(private auditsService: AuditsService) { }

    @Get()
    async findAll(@Request() req: any) {
        return this.auditsService.findAll(req.user.tenantId);
    }

    @Get('me')
    async getMe(@Request() req: any) {
        return { user: req.user };
    }

    @Get('my-assignments')
    async getMyAssignments(@Request() req: any) {
        console.log('Fetching assignments for user:', req.user.userId);
        const assignments = await this.auditsService.findMyAssignments(req.user.userId);
        console.log('Found assignments count:', assignments.length);
        console.log('Assignments:', JSON.stringify(assignments, null, 2));
        return assignments;
    }

    @Get(':id')
    async findOne(@Param('id') id: string, @Request() req: any) {
        return this.auditsService.findOne(id, req.user.tenantId);
    }

    @Post()
    async create(@Body() createDto: any, @Request() req: any) {
        const branchId = createDto.branchId;
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!branchId || !uuidRegex.test(branchId)) {
            const { BadRequestException } = require('@nestjs/common');
            throw new BadRequestException('Invalid branchId. Must be a valid UUID.');
        }
        return this.auditsService.create({
            ...createDto,
            tenantId: req.user.tenantId,
        });
    }

    @Post(':id/generate-sections')
    async generateSections(@Param('id') id: string) {
        return this.auditsService.generateSections(id);
    }

    @Patch('sections/:sectionId/assign')
    async assignSection(@Param('sectionId') sectionId: string, @Body() body: { userId: string | null }) {
        return this.auditsService.updateSectionAssignment(sectionId, body.userId);
    }

    @Post(':id/auditors')
    async assignAuditors(@Param('id') id: string, @Body() body: { userIds: string[] }) {
        return this.auditsService.assignAuditors(id, body.userIds);
    }

    @Post(':id/soh-baseline')
    @UseInterceptors(FileInterceptor('file'))
    async uploadSoh(@Param('id') id: string, @UploadedFile() file: Express.Multer.File) {
        return this.auditsService.uploadSohBaseline(id, file);
    }

    @Get(':id/variance-report')
    async getVarianceReport(@Param('id') id: string) {
        return this.auditsService.getVarianceReport(id);
    }

    @Post(':id/discrepancies/:itemId/resolve')
    async resolveDiscrepancy(
        @Param('id') id: string,
        @Param('itemId') itemId: string,
        @Body() body: { action: string, comment: string }
    ) {
        return this.auditsService.resolveDiscrepancy(id, itemId, body.action, body.comment);
    }

    @Post(':id/import-results')
    @UseInterceptors(FileInterceptor('file'))
    async importResults(@Param('id') id: string, @Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const csvData = file.buffer.toString();
        const lines = csvData.split(/\r?\n/);

        // Find header row starting with Location or Part Number
        let headerIndex = 0;
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            if (lines[i].toLowerCase().includes('location') && lines[i].toLowerCase().includes('part number')) {
                headerIndex = i;
                break;
            }
        }
        
        // Use array mode to handle multi-column 'Quantity' duplicate headers cleanly.
        const dataToParse = lines.slice(headerIndex).join('\n');
        const parsed = Papa.parse(dataToParse, { 
            header: false,
            skipEmptyLines: true,
        });

        await this.auditsService.importRawResults(id, req.user.userId, parsed.data as any[][]);
        return { message: 'Results imported successfully', count: parsed.data.length - 1 };
    }

    @Post(':id/sign-off')
    async signOff(
        @Param('id') id: string,
        @Request() req: any,
        @Body() body: { auditorTitle: string, clientName: string, clientTitle: string, comments: string }
    ) {
        return this.auditsService.signOffAudit(id, req.user.userId, body);
    }
}
