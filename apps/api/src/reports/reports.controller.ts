import { Controller, Get, Param, Request, Header } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Get('audits/:id/variance')
    async getVariance(@Param('id') id: string) {
        return this.reportsService.calculateVariance(id);
    }

    @Get('audits/:id/variance/export')
    @Header('Content-Type', 'text/csv')
    @Header('Content-Disposition', 'attachment; filename="variance_report.csv"')
    async exportCsv(@Param('id') id: string) {
        return this.reportsService.exportVarianceCsv(id);
    }
}
