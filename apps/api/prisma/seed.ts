import { PrismaClient } from '../src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- STOCKCOUNT MANAGER SEEDING START (athgadlang) ---');
    const password = await bcrypt.hash('athgadlang123', 10);

    // 1. Create Tenant (Holding Company)
    let tenant = await prisma.tenant.findFirst({
        where: { companyName: 'athgadlang Global' }
    });
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: { companyName: 'athgadlang Global', companyCode: 'ATH-001' }
        });
    }

    // 1.5 Create Item Master
    const itemMaster = await prisma.itemMaster.upsert({
        where: { tenantId_name: { tenantId: tenant.id, name: 'Default Master' } },
        update: {},
        create: {
            name: 'Default Master',
            tenantId: tenant.id,
        },
    });

    // 2. Create Brand (Sub-Company / Retail Entity)
    const brand = await prisma.brand.upsert({
        where: { brandCode: 'SC-SOLUTIONS' },
        update: {},
        create: {
            brandName: 'StockCount Solutions',
            brandCode: 'SC-SOLUTIONS',
            tenantId: tenant.id
        }
    });

    // 3. Create Branch (Physical Location)
    const branch = await prisma.branch.upsert({
        where: { branchCode: 'BR-001' },
        update: {},
        create: {
            branchName: 'Flagship Store',
            branchCode: 'BR-001',
            type: 'RETAIL',
            status: 'ACTIVE',
            poc: 'John Doe',
            branchLocation: '123 Main Street, Dubai',
            resourcesAssigned: 5,
            countersCount: 4,
            shelvesCount: 20,
            gondolasCount: 8,
            areaManagerName: 'Jane Smith',
            businessEntityType: 'Retail',
            invoiceTo: 'athgadlang Global LLC',
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
            skuCode: `SKU-${i.toString().padStart(4, '0')}`,
            skuName: `Product ${i}`,
            uom: 'EA',
            unitCostPrice: parseFloat((Math.random() * 100).toFixed(2)),
            quantity: Math.floor(Math.random() * 500),
            status: 'ACTIVE',
            tenantId: tenant.id,
            itemMasterId: itemMaster.id,
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
