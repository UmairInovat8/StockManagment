import { PrismaClient } from './src/generated/prisma-client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function run() {
    try {
        const placeholders = `($1::uuid, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::float, $12, $13::timestamp, $14::timestamp, $15::jsonb, $16::uuid, $17::uuid, $18::timestamp, $19::timestamp)`;
        const values = [
            randomUUID(), "TEST1234", "Test Name", "Brand", null, null, null, null, null, null, 0, "EA", null, null, "{}", "9611ad9b-8c1c-4e89-8d7d-5c1cf7da32f9", null, new Date().toISOString(), new Date().toISOString()
        ];
        
        const upsertQuery = `
            INSERT INTO "items" (
                "id", "sku_code", "sku_name", "brand_name", "gtin", "batch", "barcode", "qrCode", 
                "serialNumber", "upc_code", "unit_cost_price", "uom", "expiry", "productionDate", 
                "metadata", "tenant_id", "item_master_id", "created_at", "updated_at"
            ) VALUES ${placeholders}
            ON CONFLICT ("tenant_id", "sku_code") DO UPDATE SET
                "sku_name" = EXCLUDED."sku_name", "brand_name" = EXCLUDED."brand_name", "updated_at" = NOW()
            RETURNING "id"
        `;
        
        const res = await prisma.$queryRawUnsafe(upsertQuery, ...values);
        console.log("Success!", res);
    } catch(e) {
        console.error("EXACT ERROR MESSAGE:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}
run();
