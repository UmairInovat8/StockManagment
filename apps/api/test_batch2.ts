import { PrismaClient } from './src/generated/prisma-client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function run() {
    try {
        const itemValues: any[][] = [];
        for (let i = 0; i < 2; i++) {
            itemValues.push([
                randomUUID(), "BATCH_TEST_" + i, "Batch Item", "Brand", null, null, null, null, null, null, 0, "EA", null, null, "{}", "6ee1b2b6-a0dd-4892-b4f0-cd6a30b02db8", null, new Date().toISOString(), new Date().toISOString()
            ]);
        }

        let vIdx = 1;
        const placeholders = itemValues.map(() =>
            `($${vIdx++}::uuid, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}, $${vIdx++}::float, $${vIdx++}, $${vIdx++}::timestamp, $${vIdx++}::timestamp, $${vIdx++}::jsonb, $${vIdx++}::uuid, $${vIdx++}::uuid, $${vIdx++}::timestamp, $${vIdx++}::timestamp)`
        ).join(', ');

        const upsertQuery = `
            INSERT INTO "items" (
                "id", "sku_code", "sku_name", "brand_name", "gtin", "batch", "barcode", "qr_code", 
                "serial_number", "upc_code", "unit_cost_price", "uom", "expiry", "production_date", 
                "metadata", "tenant_id", "item_master_id", "created_at", "updated_at"
            ) VALUES ${placeholders}
            ON CONFLICT ("tenant_id", "sku_code") DO UPDATE SET
                "sku_name" = EXCLUDED."sku_name", "brand_name" = EXCLUDED."brand_name", "gtin" = EXCLUDED."gtin",
                "batch" = EXCLUDED."batch", "barcode" = EXCLUDED."barcode", "qr_code" = EXCLUDED."qr_code",
                "serial_number" = EXCLUDED."serial_number", "upc_code" = EXCLUDED."upc_code", "unit_cost_price" = EXCLUDED."unit_cost_price",
                "uom" = EXCLUDED."uom", "expiry" = EXCLUDED."expiry", "production_date" = EXCLUDED."production_date",
                "metadata" = EXCLUDED."metadata", "updated_at" = NOW()
            RETURNING "id", "sku_code"
        `;

        const res = await prisma.$queryRawUnsafe(upsertQuery, ...itemValues.flat());
        console.log("Success BATCH size 2:", res);
    } catch (e) {
        console.error("BATCH ERROR IS:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
run();
