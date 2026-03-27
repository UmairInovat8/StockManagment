import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';

const BATCH_SIZE = 1000;

@Injectable()
export class ItemsService {
    constructor(private prisma: PrismaService) { }

    async findAll(tenantId: string, itemMasterId?: string, page = 1, limit = 20, search?: string) {
        const skip = (page - 1) * limit;
        const where: any = { tenantId };
        if (itemMasterId) where.itemMasterId = itemMasterId;

        if (search) {
            where.OR = [
                { sku_code: { contains: search, mode: 'insensitive' } },
                { sku_name: { contains: search, mode: 'insensitive' } },
                { brand_name: { contains: search, mode: 'insensitive' } },
            ];
        }

        const [items, total] = await Promise.all([
            this.prisma.item.findMany({
                where,
                skip,
                take: limit,
                include: { identifiers: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.item.count({ where }),
        ]);

        return {
            items,
            total,
            pages: Math.ceil(total / limit),
            page,
        };
    }

    async findAllMasters(tenantId: string) {
        return this.prisma.itemMaster.findMany({
            where: { tenantId },
            include: {
                brand: {
                    select: { brandName: true }
                },
                _count: {
                    select: { items: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async createMaster(tenantId: string, name: string, brandId?: string) {
        return this.prisma.itemMaster.create({
            data: { 
                name,
                tenantId,
                ...(brandId && { brandId })
            }
        });
    }

    async create(data: any) {
        const { identifiers, expiry, productionDate, ...rest } = data;
        return this.prisma.item.create({
            data: {
                ...rest,
                expiry: expiry ? new Date(expiry) : undefined,
                productionDate: productionDate ? new Date(productionDate) : undefined,
                identifiers: { create: identifiers || [] },
            },
            include: { identifiers: true },
        });
    }

    async bulkSync(tenantId: string, fileBuffer: Buffer, itemMasterId?: string) {
        const checkJob = await this.getImportStatus(tenantId);
        if (checkJob && (checkJob.status === 'STARTING' || checkJob.status === 'PROCESSING')) {
            throw new Error('A synchronization job is already in progress for this company. Please wait for it to complete.');
        }

        const job = await this.prisma.importJob.create({
            data: {
                tenantId,
                itemMasterId, // Link masterId to job for UI accuracy
                total: 0,
                processed: 0,
                status: 'STARTING'
            }
        });

        this.runBulkSync(tenantId, job.id, fileBuffer, itemMasterId).catch(err => {
            console.error('[SYNC] Background Sync Crash:', err);
        });

        return job;
    }

    private async batchUpsertItems(
        batch: any[],
        tenantId: string,
        itemMasterId: string | undefined,
        prisma: any
    ): Promise<Map<string, string>> {
        const itemValues: any[][] = batch.map(item => [
            randomUUID(), item.sku_code, item.sku_name, item.brand_name, item.gtin, item.batch,
            item.barcode, item.qrCode, item.serialNumber, item.upc_code || null,
            item.unit_cost_price, item.uom,
            item.expiry ? new Date(item.expiry).toISOString() : null,
            item.productionDate ? new Date(item.productionDate).toISOString() : null,
            JSON.stringify(item.metadata),
            tenantId, itemMasterId || null, new Date().toISOString(), new Date().toISOString()
        ]);

        let vIdx = 1;
        const placeholders = itemValues.map(() => {
            const row = [
                `$${vIdx++}::text::uuid`, `$${vIdx++}`, `$${vIdx++}`, `$${vIdx++}`, `$${vIdx++}`,
                `$${vIdx++}`, `$${vIdx++}`, `$${vIdx++}`, `$${vIdx++}`, `$${vIdx++}`,
                `$${vIdx++}::float`, `$${vIdx++}`, `$${vIdx++}::timestamp`, `$${vIdx++}::timestamp`,
                `$${vIdx++}::jsonb`, `$${vIdx++}::text::uuid`, `$${vIdx++}::text::uuid`,
                `$${vIdx++}::timestamp`, `$${vIdx++}::timestamp`
            ].join(',');
            return `(${row})`;
        }).join(',');

        const upsertQuery = `
            INSERT INTO "items" (
                "id","sku_code","sku_name","brand_name","gtin","batch","barcode","qr_code",
                "serial_number","upc_code","unit_cost_price","uom","expiry","production_date",
                "metadata","tenant_id","item_master_id","created_at","updated_at"
            ) VALUES ${placeholders}
            ON CONFLICT ("tenant_id","sku_code") DO UPDATE SET
                "sku_name"=EXCLUDED."sku_name","brand_name"=EXCLUDED."brand_name","gtin"=EXCLUDED."gtin",
                "batch"=EXCLUDED."batch","barcode"=EXCLUDED."barcode","qr_code"=EXCLUDED."qr_code",
                "serial_number"=EXCLUDED."serial_number","upc_code"=EXCLUDED."upc_code",
                "unit_cost_price"=EXCLUDED."unit_cost_price","uom"=EXCLUDED."uom",
                "expiry"=EXCLUDED."expiry","production_date"=EXCLUDED."production_date",
                "metadata"=EXCLUDED."metadata","updated_at"=NOW()
            RETURNING "id","sku_code"
        `;

        const safeValues = itemValues.flat().map(val => {
            if (val === null || val === undefined) return null;
            if (val instanceof Date) return val.toISOString();
            if (typeof val === 'object') return JSON.stringify(val);
            return val;
        });

        const dbItems: any[] = await prisma.$queryRawUnsafe(upsertQuery, ...safeValues);
        return new Map(dbItems.map((it: any) => [it.sku_code, it.id]));
    }

    private async flushIdentifiers(batch: any[], skuToId: Map<string, string>, prisma: any) {
        const idValues: any[][] = [];
        for (const item of batch) {
            const itemId = skuToId.get(item.sku_code);
            if (!itemId) continue;
            item.identifiers.forEach((id: any) => {
                if (id.value) idValues.push([randomUUID(), id.type, id.value.toString(), itemId]);
            });
        }
        if (idValues.length === 0) return;

        const CHUNK = 1000;
        for (let j = 0; j < idValues.length; j += CHUNK) {
            const chunk = idValues.slice(j, j + CHUNK);
            let iIdx = 1;
            const idPlaceholders = chunk.map(() => `($${iIdx++}::uuid,$${iIdx++},$${iIdx++},$${iIdx++}::uuid)`).join(',');
            const idQuery = `INSERT INTO "item_identifiers" ("id","type","value","item_id") VALUES ${idPlaceholders} ON CONFLICT DO NOTHING`;
            await prisma.$executeRawUnsafe(idQuery, ...chunk.flat());
        }
    }

    private mapRow(rowData: Record<string, any>, tenantId: string): any | null {
        // Aggressive fuzzy matching (ignores case, spaces, underscores, hyphens)
        const get = (keys: string[]) => {
            const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
            const targetClean = keys.map(clean);
            
            const foundKey = Object.keys(rowData).find(k => 
                targetClean.includes(clean(k.trim()))
            );
            return foundKey ? rowData[foundKey] : undefined;
        };

        const sku_code = get(['sku_code', 'item_code', 'code', 'sku', 'product_code', 'articleno', 'article_no', 'articlecode', 'articlemasterfilecode', 'version22templatearticlemasterfilecode', 'itemid', 'item_id', 'productcode', 'skuid', 'productid', 'item_no', 'itemno'])?.toString().trim();
        const sku_name = get(['sku_name', 'item_name', 'name', 'product_name', 'description', 'itemname', 'skuname', 'productname', 'articledescription', 'article_description', 'fullname', 'item_description'])?.toString().trim();

        if (!sku_code) return null;

        const parseDate = (d: any) => { if (!d) return null; const dt = new Date(d); return isNaN(dt.getTime()) ? null : dt; };

        return {
            sku_code, 
            sku_name: sku_name || 'Unnamed Item',
            brand_name: get(['brand', 'manufacturer', 'supplier', 'brand_name', 'company'])?.toString() || null,
            gtin: get(['gtin', 'ean', 'upc'])?.toString() || null,
            batch: get(['batch', 'lot'])?.toString() || null,
            barcode: get(['barcode'])?.toString() || null,
            qrCode: get(['qr_code', 'qrcode', 'qr'])?.toString() || null,
            serialNumber: get(['serial', 'sno'])?.toString() || null,
            upc_code: null,
            unit_cost_price: parseFloat(get(['unit cost', 'price', 'cost', 'article value', 'articlevalue', 'unitprice', 'costprice', 'articlevalueper', 'articlevalueperunit'])?.toString().replace(/[^0-9.-]+/g, '') || '0'),
            uom: get(['uom', 'unit', 'measure'])?.toString() || 'EA',
            expiry: parseDate(get(['expiry', 'exp date', 'alternative', 'expirydate', 'exp_date', 'expiration'])),
            productionDate: parseDate(get(['production date', 'mfg date'])),
            metadata: { family: get(['family', 'category', 'group', 'dept', 'articlecategory1', 'article_category_1']) },
            tenantId,
            identifiers: [
                ...(get(['barcode']) ? [{ type: 'BARCODE', value: get(['barcode']) }] : []),
                ...(get(['gtin', 'ean']) ? [{ type: 'GTIN', value: get(['gtin', 'ean']) }] : []),
                ...(get(['alternative article code 1', 'alt code 1', 'altcode', 'alternativearticlecode1']) ? [{ type: 'ALT1', value: get(['alternative article code 1', 'alt code 1', 'altcode', 'alternativearticlecode1']) }] : []),
                ...(get(['alternative article code 2', 'alternativearticlecode2']) ? [{ type: 'ALT2', value: get(['alternative article code 2', 'alternativearticlecode2']) }] : []),
                ...(get(['alternative article code 3', 'alternativearticlecode3']) ? [{ type: 'ALT3', value: get(['alternative article code 3', 'alternativearticlecode3']) }] : []),
            ]
        };
    }

    private async flushBatch(
        batch: any[],
        tenantId: string,
        itemMasterId: string | undefined,
        jobId: string,
        processed: { count: number },
        failed: { count: number },
    ) {
        if (batch.length === 0) return;
        try {
            const skuToId = await this.batchUpsertItems(batch, tenantId, itemMasterId, this.prisma);
            await this.flushIdentifiers(batch, skuToId, this.prisma);
            processed.count += batch.length;
        } catch (batchErr: any) {
            console.error('[SYNC] Batch failed, falling back to row-by-row:', batchErr.message);
            let localProcessed = 0;
            for (const item of batch) {
                try {
                    const skuToId = await this.batchUpsertItems([item], tenantId, itemMasterId, this.prisma);
                    await this.flushIdentifiers([item], skuToId, this.prisma);
                    processed.count++;
                    localProcessed++;
                } catch (rowErr: any) {
                    failed.count++;
                }
                if ((localProcessed + failed.count) % 1000 === 0) {
                    await this.prisma.importJob.update({
                        where: { id: jobId },
                        data: { processed: processed.count, failed: failed.count }
                    }).catch(() => {});
                }
            }
        }
    }

    private async syncCsv(buffer: Buffer, tenantId: string, itemMasterId: string | undefined, jobId: string) {
        const Papa = require('papaparse');
        const content = buffer.toString('utf8');
        
        // Parse as raw arrays first to detect headers
        const results = Papa.parse(content, { 
            header: false, 
            skipEmptyLines: 'greedy',
            dynamicTyping: false,
            delimiter: "" // Auto-detect delimiter
        });
        
        const rawRows: string[][] = results.data as string[][];
        if (!rawRows || rawRows.length === 0) throw new Error('CSV is empty');

        const standardKeywords = ['sku', 'code', 'name', 'article', 'gtin', 'barcode', 'price'];
        let headerRowIndex = 0;
        let maxMatches = -1;

        // SMART HEADER DETECTION: Scan first 20 rows
        for (let R = 0; R < Math.min(rawRows.length, 20); R++) {
            let matches = 0;
            const row = rawRows[R];
            for (let C = 0; C < row.length; C++) {
                const cell = row[C];
                if (cell) {
                    const val = cell.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (standardKeywords.some(k => val.includes(k))) matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                headerRowIndex = R;
            }
            if (maxMatches >= 3) break; // Found a strong match
        }

        const headers: string[] = rawRows[headerRowIndex].map((h: any, i: number) => h ? h.toString().replace(/\n|\r/g, ' ').replace(/\s+/g, ' ').trim() : `Col${i}`);
        
        // Convert the remaining rows into objects using the detected headers
        const allRows: any[] = [];
        for (let r = headerRowIndex + 1; r < rawRows.length; r++) {
            const rowArr = rawRows[r];
            const rowObj: any = {};
            let hasData = false;
            for (let c = 0; c < rowArr.length; c++) {
                if (rowArr[c] !== undefined && rowArr[c] !== null && rowArr[c] !== '') {
                    rowObj[headers[c] || `Col${c}`] = rowArr[c];
                    hasData = true;
                }
            }
            if (hasData) allRows.push(rowObj);
        }

        const total = allRows.length;
        await this.prisma.importJob.update({ where: { id: jobId }, data: { total, status: 'PROCESSING' } });

        const processed = { count: 0 };
        const failed = { count: 0 };
        const BATCH = 1000;
        const sampleRows: any[] = [];

        for (let i = 0; i < total; i += BATCH) {
            const chunk = allRows.slice(i, i + BATCH);
            if (sampleRows.length < 3) sampleRows.push(...chunk.slice(0, 3 - sampleRows.length));

            const batch = chunk.map((r: any) => this.mapRow(r, tenantId)).filter(Boolean);
            
            if (batch.length > 0) {
                await this.flushBatch(batch, tenantId, itemMasterId, jobId, processed, failed);
            }
            
            // Throttled progress update
            if (processed.count % 5000 === 0 || i + BATCH >= total) {
                await this.prisma.importJob.update({
                    where: { id: jobId },
                    data: { processed: processed.count, failed: failed.count }
                }).catch(() => {});
            }
        }

        // Diagnostic Reporting: If 0 items processed but file was not empty
        if (processed.count === 0 && total > 0) {
            const headersFound = Object.keys(allRows[0] || {}).join(', ');
            const rowPreview = sampleRows.map(r => JSON.stringify(Object.values(r))).join(' | ');
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: { 
                    status: 'COMPLETED',
                    message: `Mapping failed: 0 items matched. Detected headers: [${headersFound}]. Data Preview: [${rowPreview}]. Please ensure your file has a column for SKU code.` 
                }
            });
        }
        
        return { processed: processed.count, failed: failed.count };
    }

    private async syncXlsx(buffer: Buffer, tenantId: string, itemMasterId: string | undefined, jobId: string) {
        const XLSX = require('xlsx');
        const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true, cellStyles: false, cellFormulas: false, sheets: [0] });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet['!ref']) throw new Error('Range detection failed');
        
        const scanRange = XLSX.utils.decode_range(worksheet['!ref']);
        const standardKeywords = ['sku', 'code', 'name', 'article', 'gtin', 'barcode', 'price'];
        let headerRowIndex = scanRange.s.r;
        let maxMatches = -1;

        // SMART HEADER DETECTION: Scan first 10 rows for standard keywords
        for (let R = scanRange.s.r; R <= Math.min(scanRange.e.r, scanRange.s.r + 10); ++R) {
            let matches = 0;
            for (let C = scanRange.s.c; C <= scanRange.e.c; ++C) {
                const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
                if (cell && cell.v) {
                    const val = cell.v.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
                    if (standardKeywords.some(k => val.includes(k))) matches++;
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                headerRowIndex = R;
            }
            if (maxMatches >= 3) break;
        }

        const headers: string[] = [];
        for (let c = scanRange.s.c; c <= scanRange.e.c; c++) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: headerRowIndex, c })];
            headers.push(cell ? cell.v.toString().trim() : `Col${c}`);
        }

        const totalRows = scanRange.e.r - headerRowIndex;
        await this.prisma.importJob.update({ where: { id: jobId }, data: { total: totalRows, status: 'PROCESSING' } });

        const processed = { count: 0 };
        const failed = { count: 0 };
        let currentBatch: any[] = [];
        const BATCH = 1000;
        const sampleRows: any[] = [];

        // Iterate rows starting from the detected header row
        for (let r = headerRowIndex + 1; r <= scanRange.e.r; r++) {
            const rowData: any = {};
            let hasData = false;
            for (let c = scanRange.s.c; c <= scanRange.e.c; c++) {
                const cell = worksheet[XLSX.utils.encode_cell({ r, c })];
                if (cell && cell.v !== undefined && cell.v !== null) {
                    rowData[headers[c - scanRange.s.c]] = cell.v;
                    hasData = true;
                }
            }
            if (!hasData) continue;
            if (sampleRows.length < 3) sampleRows.push(rowData);

            const row = this.mapRow(rowData, tenantId);
            if (row) currentBatch.push(row);

            if (currentBatch.length >= BATCH || r === scanRange.e.r) {
                const batch = currentBatch.splice(0);
                await this.flushBatch(batch, tenantId, itemMasterId, jobId, processed, failed);
                if (processed.count % 5000 === 0 || r === scanRange.e.r) {
                    await this.prisma.importJob.update({
                        where: { id: jobId },
                        data: { processed: processed.count, failed: failed.count }
                    }).catch(() => {});
                }
            }
        }

        // Diagnostic Reporting: If 0 items processed but file was not empty
        if (processed.count === 0 && totalRows > 0) {
            const rowPreview = sampleRows.map(r => JSON.stringify(Object.values(r))).join(' | ');
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: { 
                    status: 'COMPLETED',
                    message: `Mapping failed: 0 items matched. Detected headers: [${headers.join(', ')}]. Data Preview: [${rowPreview}]. Please ensure your file has a column for SKU code.` 
                }
            });
        }

        return { processed: processed.count, failed: failed.count };
    }

    private async runBulkSync(tenantId: string, jobId: string, fileBuffer: Buffer, itemMasterId?: string) {
        try {
            const isCsv = fileBuffer[0] !== 0xD0 && fileBuffer[0] !== 0x50;
            const result = isCsv
                ? await this.syncCsv(fileBuffer, tenantId, itemMasterId, jobId)
                : await this.syncXlsx(fileBuffer, tenantId, itemMasterId, jobId);

            const currentJob = await this.prisma.importJob.findUnique({ where: { id: jobId } });

            await this.prisma.importJob.update({
                where: { id: jobId },
                data: {
                    status: 'COMPLETED',
                    processed: result.processed,
                    message: currentJob?.message && currentJob.message.includes('Mapping failed') 
                        ? currentJob.message 
                        : `Sync successful. Processed ${result.processed} items.`
                }
            });
        } catch (err: any) {
            await this.prisma.importJob.update({
                where: { id: jobId },
                data: { status: 'FAILED', message: err.message }
            }).catch(() => {});
        }
    }

    async getImportStatus(tenantId: string) {
        // First, check for an active job
        const activeJob = await this.prisma.importJob.findFirst({
            where: { tenantId, status: { in: ['STARTING', 'PROCESSING'] } },
            orderBy: { createdAt: 'desc' }
        });

        if (activeJob) {
            // Auto-recover stalled jobs (no progress in 5 minutes)
            const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
            if (activeJob.updatedAt < fiveMinsAgo) {
                return this.prisma.importJob.update({
                    where: { id: activeJob.id },
                    data: { status: 'FAILED', message: 'Sync stalled — no progress for 5 minutes.' }
                });
            }
            return activeJob;
        }

        // If no active job, return the most recent job (completed/failed) 
        // from the last 24 hours so the frontend can read its final status.
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return this.prisma.importJob.findFirst({
            where: { tenantId, createdAt: { gte: oneDayAgo } },
            orderBy: { createdAt: 'desc' }
        });
    }

    async deleteMany(tenantId: string, ids: string[]) {
        await this.prisma.itemIdentifier.deleteMany({ where: { itemId: { in: ids } } });
        return this.prisma.item.deleteMany({ where: { id: { in: ids }, tenantId } });
    }

    async deleteAll(tenantId: string, itemMasterId?: string) {
        await this.prisma.importJob.updateMany({
            where: { tenantId, status: { in: ['STARTING', 'PROCESSING'] } },
            data: { status: 'FAILED', message: 'Cleared by user' }
        }).catch(() => {});

        try {
            if (itemMasterId) {
                await this.prisma.$executeRaw`
                    DELETE FROM "item_identifiers" USING "items"
                    WHERE "item_identifiers"."item_id" = "items"."id"
                    AND "items"."tenant_id" = ${tenantId}::uuid
                    AND "items"."item_master_id" = ${itemMasterId}::uuid
                `;
                await this.prisma.$executeRaw`
                    DELETE FROM "items"
                    WHERE "tenant_id" = ${tenantId}::uuid AND "item_master_id" = ${itemMasterId}::uuid
                `;
            } else {
                await this.prisma.$executeRaw`
                    DELETE FROM "item_identifiers" USING "items"
                    WHERE "item_identifiers"."item_id" = "items"."id"
                    AND "items"."tenant_id" = ${tenantId}::uuid
                `;
                await this.prisma.$executeRaw`
                    DELETE FROM "items" WHERE "tenant_id" = ${tenantId}::uuid
                `;
            }
            return { count: 0 };
        } catch (err: any) {
            throw new Error(`Failed to clear catalog: ${err.message}`);
        }
    }
}
