import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { parseFileToRows, getRowValue } from '../common/parse-file.util';

@Injectable()
export class AuditsService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string) {
        return this.prisma.audit.findMany({
            where: { tenantId, deletedAt: null },
            include: {
                branch: { select: { branchName: true } },
                _count: { select: { sections: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string, tenantId: string) {
        console.log(`[findOne] id=${id} tenantId=${tenantId}`);
        const result = await this.prisma.audit.findFirst({
            where: { id, tenantId, deletedAt: null },
            include: {
                branch: true,
                itemMaster: true,
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
                    status: { not: 'COMPLETED' },
                    deletedAt: null
                }
            },
            include: {
                audit: true,
                location: true
            }
        });
    }

    async create(data: any) {
        const auditDateTime = data.auditDateTime || data.audit_date_time;
        const { audit_date_time, ...rest } = data; // Clean up old field if present
        return this.prisma.audit.create({
            data: {
                ...rest,
                auditDateTime: auditDateTime ? new Date(auditDateTime) : undefined,
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
            throw new Error(`The branch "${audit.branch?.branchName}" has no locations configured. Please add locations to this branch first.`);
        }

        // Delete existing sections to regenerate
        await this.prisma.auditSection.deleteMany({ where: { auditId } });

        const sections = locations.map(loc => ({
            auditId,
            locationId: loc.id,
            status: 'OPEN',
        }));

        return this.prisma.auditSection.createMany({
            data: sections as any,
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
        const audit = await this.prisma.audit.findUnique({
            where: { id: auditId },
            include: { tenant: true }
        });

        if (!audit) throw new Error('Audit not found');

        const tenantMetadata: any = audit.tenant.metadata || {};
        const thresholds = tenantMetadata.familyThresholds || {};

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
            
            const unitCost = b.item.unitCostPrice || 0;
            const varianceValue = variance * unitCost;

            const itemMeta: any = b.item.metadata || {};
            const family = itemMeta.countitFamily || 'DEFAULT';
            const familyThresholdJson = thresholds[family] || thresholds['DEFAULT'];
            let thresholdPercent = 0;
            if (familyThresholdJson) {
                // e.g. "TH 15%" -> 15
                const parsed = parseFloat(familyThresholdJson.toString().replace(/[^0-9.-]+/g, ""));
                if (!isNaN(parsed)) thresholdPercent = parsed;
            }

            let isResolved = false;
            let accuracyPercent = 0;
            if (variance === 0) {
                isResolved = true;
                if (b.quantity > 0) accuracyPercent = 100;
            } else if (thresholdPercent > 0) {
                const percentVariance = b.quantity > 0 ? (Math.abs(variance) / b.quantity) * 100 : 100;
                if (percentVariance <= thresholdPercent) {
                    isResolved = true;
                }
            }
            if (b.quantity > 0 && variance !== 0) {
                 accuracyPercent = Math.max(0, (1 - Math.abs(variance) / b.quantity)) * 100;
            }

            return {
                itemId: b.itemId,
                sku: b.item.skuCode,
                name: b.item.skuName,
                soh: b.quantity,
                counted: counted,
                variance: variance,
                varianceValue: varianceValue,
                accuracyPercent: parseFloat(accuracyPercent.toFixed(2)),
                isResolved: isResolved,
                status: variance === 0 ? 'MATCHED' : (isResolved ? 'RESOLVED_AUTO' : 'DISCREPANCY')
            };
        });

        // Also check if there are items counted that were not in baseline
        const missingFromBaselineIds = Object.keys(itemCounts).filter(id => !baselines.find(b => b.itemId === id));
        for (const itemId of missingFromBaselineIds) {
            const item = await this.prisma.item.findUnique({ where: { id: itemId } });
            if (item) {
                const counted = itemCounts[itemId];
                const unitCost = item.unitCostPrice || 0;
                const varianceValue = counted * unitCost;

                report.push({
                    itemId: itemId,
                    sku: item.skuCode,
                    name: item.skuName,
                    soh: 0,
                    counted: counted,
                    variance: counted, // variance is purely the counted amount
                    varianceValue: varianceValue,
                    accuracyPercent: 0,
                    isResolved: counted === 0,
                    status: counted === 0 ? 'MATCHED' : 'UNEXPECTED'
                });
            }
        }

        return report;
    }

    async importRawResults(auditId: string, userId: string, rows: any[][]) {
        if (!rows || rows.length < 2) return;

        const audit = await this.prisma.audit.findUnique({ where: { id: auditId } });
        if (!audit) throw new Error('Audit not found');

        const headers = rows[0].map(h => typeof h === 'string' ? h.toLowerCase().trim() : '');
        
        const locIndex = headers.indexOf('location');
        const partIndex = headers.indexOf('part number');
        let resultQtyIndex = headers.lastIndexOf('quantity'); // Final quantity column is Result Quantity
        if (resultQtyIndex === -1 && headers.indexOf('result qty') > -1) {
            resultQtyIndex = headers.indexOf('result qty');
        }

        if (locIndex === -1 || partIndex === -1 || resultQtyIndex === -1) {
            throw new Error('CSV missing required columns: Location, Part Number, or Quantity');
        }

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            const locCode = row[locIndex];
            const partNum = row[partIndex];
            const qtyStr = row[resultQtyIndex];

            if (!locCode || !partNum || qtyStr == null || qtyStr === '' || qtyStr === '#N/A') continue;

            const quantity = parseFloat(qtyStr);
            if (isNaN(quantity)) continue;

            const location = await this.prisma.location.findFirst({
                where: { branchId: audit.branchId, code: locCode }
            });

            let section: any = null;
            if (location) {
                section = await this.prisma.auditSection.findFirst({
                    where: { auditId, locationId: location.id }
                });
            }

            if (!section) {
                continue;
            }

            const item = await this.prisma.item.findFirst({
                where: { 
                    skuCode: partNum.toString(), 
                    tenantId: audit.tenantId, 
                    itemMasterId: audit.itemMasterId, // Scoped to master
                    deletedAt: null 
                }
            });

            if (!item) {
                continue;
            }

            const clientEventId = `IMPORT_${auditId}_${section.id}_${item.id}_${Date.now()}_${i}`;
            
            await this.prisma.countEvent.upsert({
                where: { clientEventId: clientEventId },
                update: {},
                create: {
                    clientEventId: clientEventId,
                    tenantId: audit.tenantId,
                    sectionId: section.id,
                    itemId: item.id,
                    userId,
                    quantity,
                    scannedAt: new Date(),
                    dataSource: 'IMPORT'
                }
            });

            const sum = await this.prisma.countEvent.aggregate({
                where: { sectionId: section.id, itemId: item.id },
                _sum: { quantity: true },
            });

            await this.prisma.sectionItemTotal.upsert({
                where: { sectionId_itemId: { sectionId: section.id, itemId: item.id } },
                update: { total: sum._sum.quantity || 0 },
                create: { sectionId: section.id, itemId: item.id, total: sum._sum.quantity || 0 },
            });
        }
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
            this.prisma.clientSignoff.upsert({
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

    async diagnoseSohFile(auditId: string, file: Express.Multer.File) {
        const audit = await this.prisma.audit.findUnique({ where: { id: auditId } });
        if (!audit) throw new Error('Audit not found');

        const rows = parseFileToRows(file);
        const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
        const preview = rows.slice(0, 5);

        // Check if sample SKUs match the item master
        const sampleSkuMatches: any[] = [];
        for (const row of rows.slice(0, 10)) {
            const skuVal = Object.values(row)[0]?.toString().trim();
            if (!skuVal) continue;
            const found = await this.prisma.item.findFirst({
                where: { skuCode: skuVal, tenantId: audit.tenantId, itemMasterId: audit.itemMasterId, deletedAt: null }
            });
            sampleSkuMatches.push({ sku: skuVal, matched: !!found });
        }

        const itemCount = await this.prisma.item.count({ where: { tenantId: audit.tenantId, itemMasterId: audit.itemMasterId } });

        return {
            totalRowsParsed: rows.length,
            detectedHeaders: headers,
            preview,
            sampleSkuMatches,
            itemMasterItemCount: itemCount,
            auditItemMasterId: audit.itemMasterId,
        };
    }

    async uploadSohBaseline(auditId: string, file: Express.Multer.File) {
        const audit = await this.prisma.audit.findUnique({ where: { id: auditId } });
        if (!audit) throw new Error('Audit not found');

        const branchId = audit.branchId;
        const items = parseFileToRows(file);
        
        let imported = 0;
        let skipped = 0;


        // DIAGNOSTIC: capture what the file looks like before any processing
        const detectedHeaders = items.length > 0 ? Object.keys(items[0]) : [];
        const firstRow = items.length > 0 ? items[0] : {};
        console.log(`[SOH-IMPORT] File parsed: ${items.length} rows`);
        // Log ALL columns from first row including __EMPTY to find hidden data
        console.log('[SOH-IMPORT] --- FULL FIRST ROW ---');
        Object.entries(firstRow).slice(0, 15).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                console.log(`  "${k}" = "${v}" (${typeof v})`);
            }
        });
        // Also check row index 5 to see variation
        if (items.length > 5) {
            console.log('[SOH-IMPORT] --- ROW 5 ---');
            Object.entries(items[5]).slice(0, 15).forEach(([k, v]) => {
                if (v !== undefined && v !== null && v !== '') {
                    console.log(`  "${k}" = "${v}" (${typeof v})`);
                }
            });
        }

        const getMapping = (rowData: any) => {
            const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            // Helper: get value by trying explicit header names first (case-insensitive), 
            // then fuzzy keyword matching — skipping __EMPTY columns
            const get = (keys: string[]) => {
                const rowKeys = Object.keys(rowData).filter(k => !k.startsWith('__EMPTY') && k.trim());
                const cleanedKeys = keys.map(k => clean(k));
                
                // Pass 1: exact match after cleaning
                for (const rowKey of rowKeys) {
                    const cleanedRowKey = clean(rowKey);
                    if (cleanedKeys.includes(cleanedRowKey)) {
                        const val = rowData[rowKey];
                        if (val !== undefined && val !== null && val !== '') return val;
                    }
                }
                
                // Pass 2: row key STARTS WITH any keyword (e.g. 'articlecode' starts with 'article')
                for (const rowKey of rowKeys) {
                    const cleanedRowKey = clean(rowKey);
                    if (cleanedKeys.some(kw => cleanedRowKey.startsWith(kw) || kw.startsWith(cleanedRowKey))) {
                        const val = rowData[rowKey];
                        if (val !== undefined && val !== null && val !== '') return val;
                    }
                }
                
                return undefined;
            };

            const sku = get(['article code', 'articlecode', 'sku code', 'skupcode', 'item code', 'itemcode', 
                             'sku', 'code', 'product code', 'article no', 'item no', 'barcode', 'material']);
            const quantityRaw = get(['quantity', 'soh', 'stock on hand', 'stockonhand', 'stock', 'balance', 'qty']);
            const locationCode = get(['location', 'warehouse', 'bin', 'rack', 'area'])?.toString().trim();

            return { sku, quantityRaw, locationCode };
        };

        // Test mapping on first row to detect column mismatches early
        const firstMapping = items.length > 0 ? getMapping(items[0]) : { sku: undefined, quantityRaw: undefined };
        console.log(`[SOH-IMPORT] First row mapping result: SKU="${firstMapping.sku}", QTY="${firstMapping.quantityRaw}"`);

        let rowIndex = 0;
        for (const data of items) {
            rowIndex++;
            let { sku, quantityRaw, locationCode } = getMapping(data);
            
            // Auto-generate a unique SKU if the file provided 0, empty, or missing SKU
            if (sku === undefined || sku === null || sku === '' || sku.toString() === '0') {
                sku = `AUTO-${rowIndex}-${Math.floor(Math.random() * 1000)}`;
            }


            const quantity = parseFloat(String(quantityRaw).replace(/[^0-9.-]+/g, ""));
            if (isNaN(quantity)) {
                console.warn(`[SOH-IMPORT] Skipping row: Invalid Quantity format (${quantityRaw}) for SKU ${sku}`);
                skipped++;
                continue;
            }

            if (locationCode) {
                const locationMatch = await this.prisma.location.findFirst({
                    where: { branchId, code: locationCode }
                });
                if (!locationMatch) {
                    console.warn(`[SOH-IMPORT] Location ${locationCode} not found in branch ${branchId}. But continuing baseline import anyway.`);
                    // Removed skipped++ and continue here because SOH doesn't require location
                }
            }

            // Primary lookup: exact item master match
            let item = await this.prisma.item.findFirst({
                where: { 
                    skuCode: sku.toString(), 
                    tenantId: audit.tenantId, 
                    itemMasterId: audit.itemMasterId, 
                    deletedAt: null 
                },
            });

            // Fallback: search across ALL item masters in tenant (handles cross-master imports)
            if (!item) {
                item = await this.prisma.item.findFirst({
                    where: { 
                        skuCode: sku.toString(), 
                        tenantId: audit.tenantId, 
                        deletedAt: null 
                    },
                });
                if (item) {
                    console.log(`[SOH-IMPORT] SKU ${sku} matched via fallback (different itemMaster: ${item.itemMasterId})`);
                }
            }

            // [NEW] Auto-create item if it doesn't exist anywhere
            if (!item) {
                const itemName = locationCode 
                    ? `Item at ${locationCode} (${sku})` 
                    : `Unmapped Item (${sku})`;
                console.log(`[SOH-IMPORT] SKU ${sku} NOT FOUND. Auto-creating new item.`);
                item = await this.prisma.item.create({
                    data: {
                        skuCode: sku.toString(),
                        skuName: itemName,
                        tenantId: audit.tenantId,
                        itemMasterId: audit.itemMasterId,
                        status: 'ACTIVE'
                    }
                });
            }

            if (item) {
                await this.prisma.auditSohBaseline.upsert({
                    where: { auditId_itemId: { auditId, itemId: item.id } },
                    update: { quantity },
                    create: { auditId, itemId: item.id, quantity },
                });
                imported++;
            } else {
                skipped++;
            }
        }

        console.log(`[SOH-IMPORT] Result: ${imported} imported, ${skipped} skipped, ${items.length} total rows`);
        
        return { 
            message: 'SOH Baseline uploaded successfully', 
            imported, 
            skipped, 
            total: items.length,
            debug: {
                detectedHeaders,
                firstRowSample: firstRow,
                firstRowMapping: firstMapping
            }
        };
    }
}
