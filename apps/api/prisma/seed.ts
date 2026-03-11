import { PrismaClient } from '../src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('--- STOCKCOUNT MANAGER SEEDING START (athgadlang) ---');
    const password = await bcrypt.hash('athgadlang123', 10);

    // 1. Create Tenant, Brand, Branch
    let tenant = await prisma.tenant.findFirst({
        where: { name: 'athgadlang Global' }
    });
    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: { name: 'athgadlang Global' }
        });
    }

    const brand = await prisma.brand.upsert({
        where: { name: 'StockCount Solutions' },
        update: {},
        create: { name: 'StockCount Solutions', tenantId: tenant.id }
    });

    const branch = await prisma.branch.upsert({
        where: { code: 'BR-001' },
        update: {},
        create: { name: 'Flagship Store', code: 'BR-001', brandId: brand.id, tenantId: tenant.id },
    });

    // 2. Roles
    const roles = ['Admin', 'AuditManager', 'Auditor'];
    const roleMap = {};
    for (const roleName of roles) {
        const r = await prisma.role.upsert({
            where: { name_tenantId: { name: roleName, tenantId: tenant.id } },
            update: {},
            create: { name: roleName, tenantId: tenant.id }
        });
        roleMap[roleName] = r.id;
    }

    // 3. Admin & Manager
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

    // 4. 8 Auditors
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

    // 5. 20 Locations (Root + Children)
    console.log('Creating 20 Locations...');
    for (let i = 1; i <= 20; i++) {
        const code = `LOC-${i.toString().padStart(2, '0')}`;
        await prisma.location.upsert({
            where: { branchId_code: { branchId: branch.id, code } },
            update: {},
            create: {
                code,
                qrValue: `QR-LOC-${i}`,
                branchId: branch.id,
            },
        });
    }

    // 6. 2000 Items
    console.log('Seeding 2000 items (this may take a moment)...');
    const itemsData: any[] = [];
    for (let i = 1; i <= 2000; i++) {
        itemsData.push({
            sku: `SKU-${i.toString().padStart(4, '0')}`,
            name: `Product ${i}`,
            tenantId: tenant.id,
        });
    }

    // Use createMany for performance
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
