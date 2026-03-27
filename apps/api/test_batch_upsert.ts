import { PrismaClient } from './src/generated/prisma-client';
import { randomUUID } from 'crypto';

async function testBatch() {
    const prisma = new PrismaClient();
    const tenantId = '8692f3d3-be53-476f-bda4-29256566c94b';
    const batchSize = 1000;
    const batch = Array.from({ length: batchSize }, (_, i) => ({
        sku_code: `BATCHTEST-${i}-${Date.now()}`,
        sku_name: `Test Item ${i}`,
        brand_name: 'Test',
        metadata: {}
    }));

    console.log(`Starting upsert of ${batchSize} items...`);
    const start = Date.now();

    try {
        const itemValues: any[][] = batch.map(item => [
            randomUUID(), item.sku_code, item.sku_name, item.brand_name, null, null,
            null, null, null, null,
            10.0, 'EA',
            null, null, JSON.stringify(item.metadata),
            tenantId, null, new Date().toISOString(), new Date().toISOString()
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
                "sku_name"=EXCLUDED."sku_name","brand_name"=EXCLUDED."brand_name","updated_at"=NOW()
            RETURNING "id"
        `;

        const safeValues = itemValues.flat();
        await prisma.$queryRawUnsafe(upsertQuery, ...safeValues);
        console.log(`SUCCESS: Upserted ${batchSize} items in ${Date.now() - start}ms`);
    } catch (err: any) {
        console.error('BATCH ERROR:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}
testBatch();
