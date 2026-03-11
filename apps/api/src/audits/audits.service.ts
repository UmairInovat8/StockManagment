import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuditsService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.audit.findMany({
            where: { tenantId },
            include: {
                branch: { select: { name: true } },
                _count: { select: { sections: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string, tenantId: string) {
        console.log(`[findOne] id=${id} tenantId=${tenantId}`);
        const result = await this.prisma.audit.findFirst({
            where: { id, tenantId },
            include: {
                branch: true,
                sections: {
                    include: {
                        location: true,
                        assignedUser: { select: { id: true, firstName: true, lastName: true, email: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                },
                assignments: {
                    include: {
                        user: { select: { id: true, firstName: true, lastName: true, email: true } }
                    }
                }
            }
        });
        console.log(`[findOne] result=${result ? result.name : 'null'}`);
        return result;
    }

    async findMyAssignments(userId: string) {
        return this.prisma.auditSection.findMany({
            where: {
                assignedUserId: userId,
                status: { not: 'COMPLETED' },
                audit: {
                    status: { not: 'COMPLETED' }
                }
            },
            include: {
                audit: true,
                location: true
            }
        });
    }

    async create(data: any) {
        const { scheduledDate, ...rest } = data;
        return this.prisma.audit.create({
            data: {
                ...rest,
                scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
            },
            include: { branch: true }
        });
    }

    async generateSections(auditId: string) {
        const audit = await this.prisma.audit.findUnique({
            where: { id: auditId },
            include: { branch: true },
        });

        if (!audit) throw new Error('Audit not found');

        const locations = await this.prisma.location.findMany({
            where: { branchId: audit.branchId },
        });

        if (locations.length === 0) {
            throw new Error(`The branch "${audit.branch?.name}" has no locations configured. Please add locations to this branch first.`);
        }

        // Delete existing sections to regenerate
        await this.prisma.auditSection.deleteMany({ where: { auditId } });

        const sections = locations.map(loc => ({
            auditId,
            locationId: loc.id,
            status: 'OPEN',
        }));

        return this.prisma.auditSection.createMany({
            data: sections,
        });
    }

    async assignAuditors(auditId: string, userIds: string[]) {
        // First clear existing if any or just add new
        // For simplicity, we'll just create many and ignore duplicates if they exist
        const data = userIds.map(userId => ({ auditId, userId }));

        await this.prisma.auditAssignment.deleteMany({
            where: { auditId, userId: { in: userIds } }
        });

        return this.prisma.auditAssignment.createMany({
            data
        });
    }

    async updateSectionAssignment(sectionId: string, userId: string | null) {
        return this.prisma.auditSection.update({
            where: { id: sectionId },
            data: { assignedUserId: userId }
        });
    }

    async getVarianceReport(auditId: string) {
        const baselines = await this.prisma.auditSohBaseline.findMany({
            where: { auditId },
            include: { item: true }
        });

        const countedTotals = await this.prisma.sectionItemTotal.findMany({
            where: { section: { auditId } }
        });

        // Aggregate counts across all sections for each item
        const itemCounts: Record<string, number> = {};
        countedTotals.forEach(ct => {
            itemCounts[ct.itemId] = (itemCounts[ct.itemId] || 0) + ct.total;
        });

        const report = baselines.map(b => {
            const counted = itemCounts[b.itemId] || 0;
            const variance = counted - b.quantity;
            return {
                itemId: b.itemId,
                sku: b.item.sku,
                name: b.item.name,
                soh: b.quantity,
                counted: counted,
                variance: variance,
                varianceValue: variance * 0, // Placeholder for price logic if needed later
                status: variance === 0 ? 'MATCHED' : 'DISCREPANCY'
            };
        });

        // Also check if there are items counted that were not in baseline
        const missingFromBaselineIds = Object.keys(itemCounts).filter(id => !baselines.find(b => b.itemId === id));
        for (const itemId of missingFromBaselineIds) {
            const item = await this.prisma.item.findUnique({ where: { id: itemId } });
            if (item) {
                const counted = itemCounts[itemId];
                report.push({
                    itemId: itemId,
                    sku: item.sku,
                    name: item.name,
                    soh: 0,
                    counted: counted,
                    variance: counted,
                    varianceValue: 0,
                    status: 'UNEXPECTED'
                });
            }
        }

        return report;
    }

    async resolveDiscrepancy(auditId: string, itemId: string, action: string, comment: string) {
        return this.prisma.discrepancyCase.upsert({
            where: { auditId_itemId: { auditId, itemId } },
            update: { status: 'RESOLVED' },
            create: {
                auditId,
                itemId,
                status: 'RESOLVED'
            }
        });
    }

    async signOffAudit(auditId: string, userId: string, data: { auditorTitle: string, clientName: string, clientTitle: string, comments: string }) {
        return this.prisma.$transaction([
            this.prisma.signoff.upsert({
                where: { auditId },
                update: {
                    userId,
                    signature: `SIGNED_BY_${data.auditorTitle}_AND_${data.clientName}`,
                },
                create: {
                    auditId,
                    userId,
                    signature: `SIGNED_BY_${data.auditorTitle}_AND_${data.clientName}`,
                }
            }),
            this.prisma.audit.update({
                where: { id: auditId },
                data: { status: 'COMPLETED' }
            })
        ]);
    }

    async uploadSohBaseline(auditId: string, items: { sku: string, quantity: number }[]) {
        const audit = await this.prisma.audit.findUnique({ where: { id: auditId } });
        if (!audit) throw new Error('Audit not found');

        for (const data of items) {
            const item = await this.prisma.item.findFirst({
                where: { sku: data.sku, tenantId: audit.tenantId },
            });

            if (item) {
                await this.prisma.auditSohBaseline.upsert({
                    where: { auditId_itemId: { auditId, itemId: item.id } },
                    update: { quantity: Number(data.quantity) },
                    create: { auditId, itemId: item.id, quantity: Number(data.quantity) },
                });
            }
        }
    }
}
