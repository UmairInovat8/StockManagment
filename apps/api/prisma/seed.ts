import { PrismaClient } from '../src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- STOCKCOUNT MANAGER SEEDING START (athgadlang) ---');
    const password = await bcrypt.hash('athgadlang123', 10);

    // 1. Create Tenant (Holding Company)
    let tenant = await prisma.tenant.findFirst({
        where: { company_name: 'athgadlang Global' }
    });
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: { company_name: 'athgadlang Global', company_code: 'ATH-001' }
        });
    }

    // 2. Create Brand (Sub-Company / Retail Entity)
    const brand = await prisma.brand.upsert({
        where: { brand_code: 'SC-SOLUTIONS' },
        update: {},
        create: {
            brand_name: 'StockCount Solutions',
            brand_code: 'SC-SOLUTIONS',
            tenantId: tenant.id
        }
    });

    // 3. Create Branch (Physical Location)
    const branch = await prisma.branch.upsert({
        where: { branch_code: 'BR-001' },
        update: {},
        create: {
            branch_name: 'Flagship Store',
            branch_code: 'BR-001',
            type: 'RETAIL',
            status: 'ACTIVE',
            poc: 'John Doe',
            branch_location: '123 Main Street, Dubai',
            resources_assigned: 5,
            counters_count: 4,
            shelves_count: 20,
            gondolas_count: 8,
            area_manager_name: 'Jane Smith',
            business_entity_type: 'Retail',
            invoice_to: 'athgadlang Global LLC',
            brandId: brand.id,
            tenantId: tenant.id
        },
    });

    // 4. Roles
    const roles = ['Admin', 'AuditManager', 'Auditor'];
    const roleMap: Record<string, string> = {};
    for (const roleName of roles) {
        const r = await prisma.role.upsert({
            where: { name_tenantId: { name: roleName, tenantId: tenant.id } },
            update: {},
            create: { name: roleName, tenantId: tenant.id }
        });
        roleMap[roleName] = r.id;
    }

    // 5. Admin & Manager
    const managerEmail = 'manager@athgadlang.com';
    await prisma.user.upsert({
        where: { email: managerEmail },
        update: {},
        create: {
            email: managerEmail,
            password,
            firstName: 'Lead',
            lastName: 'Architect',
            tenantId: tenant.id,
            roles: { create: { roleId: roleMap['AuditManager'] } },
            branchAccess: { create: { branchId: branch.id } },
        },
    });

    // 6. 8 Auditors
    console.log('Creating 8 Auditors...');
    for (let i = 1; i <= 8; i++) {
        const email = `auditor${i}@athgadlang.com`;
        await prisma.user.upsert({
            where: { email },
            update: {},
            create: {
                email,
                password,
                firstName: `Auditor`,
                lastName: `${i}`,
                tenantId: tenant.id,
                roles: { create: { roleId: roleMap['Auditor'] } },
                branchAccess: { create: { branchId: branch.id } },
            },
        });
    }

    // 7. 20 Locations (with LocationType)
    console.log('Creating 20 Locations...');
    const locationTypes = ['SHELF', 'COUNTER', 'GONDOLA', 'BIN'] as const;
    for (let i = 1; i <= 20; i++) {
        const code = `LOC-${i.toString().padStart(2, '0')}`;
        const locType = locationTypes[i % locationTypes.length];
        await prisma.location.upsert({
            where: { branchId_code: { branchId: branch.id, code } },
            update: {},
            create: {
                code,
                qrValue: `QR-LOC-${i}`,
                locationType: locType,
                branchId: branch.id,
            },
        });
    }

    // 8. 2000 Items (with BRD attribute names)
    console.log('Seeding 2000 items (this may take a moment)...');
    const itemsData: any[] = [];
    for (let i = 1; i <= 2000; i++) {
        itemsData.push({
            sku_code: `SKU-${i.toString().padStart(4, '0')}`,
            sku_name: `Product ${i}`,
            uom: 'EA',
            unit_cost_price: parseFloat((Math.random() * 100).toFixed(2)),
            quantity: Math.floor(Math.random() * 500),
            status: 'ACTIVE',
            tenantId: tenant.id,
        });
    }

    await prisma.item.createMany({
        data: itemsData,
        skipDuplicates: true
    });

    console.log('--- SEEDING COMPLETED SUCCESSFULLY by athgadlang ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
