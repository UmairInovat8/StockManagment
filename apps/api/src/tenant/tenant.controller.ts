import { Controller, Get, Patch, Post, Body, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as Papa from 'papaparse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('tenant')
@UseGuards(JwtAuthGuard)
export class TenantController {
    constructor(private prisma: PrismaService) { }

    @Get()
    async getProfile(@Request() req: any) {
        return this.prisma.tenant.findUnique({
            where: { id: req.user.tenantId },
            include: {
                _count: {
                    select: { brands: true, branches: true, items: true, audits: true, users: true },
                },
            },
        });
    }

    @Get('dashboard')
    async getDashboard(@Request() req: any) {
        const tenantId = req.user.tenantId;

        // Fetch counts
        const auditsCount = await this.prisma.audit.count({ where: { tenantId } });
        const usersCount = await this.prisma.user.count({ where: { tenantId } });
        // Items logged (throughput)
        const itemsCount = await this.prisma.countEvent.count({ where: { tenantId } });

        // Calculate variance index
        const tenantAudits = await this.prisma.audit.findMany({ where: { tenantId }, select: { id: true } });
        const auditIds = tenantAudits.map(a => a.id);
        const totalDiscrepancies = await this.prisma.discrepancyCase.count({ where: { auditId: { in: auditIds } } });
        const totalItemsCounted = await this.prisma.sectionItemTotal.count({ where: { section: { audit: { tenantId } } } });
        
        let varianceRate = 0;
        if (totalItemsCounted > 0) {
            varianceRate = parseFloat(((totalDiscrepancies / totalItemsCounted) * 100).toFixed(1));
        }

        const audits = await this.prisma.audit.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'desc' },
            take: 3,
            include: { branch: true }
        });

        const recentActivity = audits.map(a => ({
            user: a.status === 'COMPLETED' ? 'Auditor / System' : 'System Node',
            action: `${a.status === 'COMPLETED' ? 'Completed' : 'Initiated'} audit at ${a.branch?.branch_name || 'Branch'}`,
            time: new Date(a.updatedAt).toLocaleDateString(),
            iconName: a.status === 'COMPLETED' ? 'Shield' : 'Globe'
        }));

        // Calculate audit velocity (placeholder chart for the last 12 months)
        const allAudits = await this.prisma.audit.findMany({ where: { tenantId }, select: { createdAt: true } });
        const monthlyCounts = new Array(12).fill(0);
        const currentMonth = new Date().getMonth();
        
        allAudits.forEach(audit => {
            const auditMonth = new Date(audit.createdAt).getMonth();
            const yearDiff = new Date().getFullYear() - new Date(audit.createdAt).getFullYear();
            if (yearDiff === 0 || (yearDiff === 1 && auditMonth > currentMonth)) {
                // Map to 0-11 where 11 is current month
                let targetIndex = 11 - (currentMonth - auditMonth);
                if (targetIndex > 11) targetIndex -= 12;
                if (targetIndex >= 0 && targetIndex < 12) {
                    monthlyCounts[targetIndex] += 1;
                }
            }
        });
        
        // Ensure some baseline activity if system is brand new for aesthetics, or strictly 0s. 
        // We'll leave it as actual metrics (0s mostly if empty)
        const auditVelocity = monthlyCounts;

        return {
            totalAudits: auditsCount,
            activeAuditors: usersCount,
            itemsLogged: itemsCount > 1000000 ? (itemsCount/1000000).toFixed(1) + 'M' : itemsCount > 1000 ? (itemsCount/1000).toFixed(1) + 'k' : itemsCount.toString(),
            varianceRate,
            recentActivity,
            auditVelocity
        };
    }

    @Patch()
    async updateProfile(@Body() body: any, @Request() req: any) {
        const { company_name, company_code, metadata } = body;
        return this.prisma.tenant.update({
            where: { id: req.user.tenantId },
            data: {
                ...(company_name && { company_name }),
                ...(company_code && { company_code }),
                ...(metadata && { metadata }),
            },
        });
    }

    @Post('thresholds/import')
    @UseInterceptors(FileInterceptor('file'))
    async importThresholds(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
        const csvString = file.buffer.toString();
        const lines = csvString.split(/\r?\n/);

        let headerIndex = 0;
        for (let i = 0; i < Math.min(10, lines.length); i++) {
            if (lines[i].toLowerCase().includes('countit family') || lines[i].toLowerCase().includes('family') || lines[i].toLowerCase().includes('value in percent')) {
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

        const familyThresholds: Record<string, string> = {};
        for (const row of parsed.data as any[]) {
            const family = row['Countit Family'] || row['Family'] || row['Category'];
            const threshold = row['Value in Percent'] || row['Threshold'] || row['Value'];
            if (family && threshold) {
                familyThresholds[family] = threshold;
            }
        }

        const tenant = await this.prisma.tenant.findUnique({ where: { id: req.user.tenantId } });
        const metadata: any = tenant?.metadata || {};
        metadata.familyThresholds = { ...(metadata.familyThresholds || {}), ...familyThresholds };

        await this.prisma.tenant.update({
            where: { id: req.user.tenantId },
            data: { metadata: metadata as any }
        });

        return { message: 'Thresholds imported successfully', count: Object.keys(familyThresholds).length };
    }
}
