import { PrismaClient } from './src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding test data for mobile app testing...');

    // 1. Upsert a Tenant
    // Since Tenant has no direct unique constraint on name, we find first or create
    let tenant = await prisma.tenant.findFirst({ where: { name: 'Kamak Apparel' } });
    if (!tenant) {
        tenant = await prisma.tenant.create({ data: { name: 'Kamak Apparel' } });
    }
    console.log(`Ensured Tenant: ${tenant.name}`);

    // 2. Upsert a Brand
    const brand = await prisma.brand.upsert({
        where: { name: 'Kamak Originals' },
        update: {},
        create: {
            name: 'Kamak Originals',
            tenantId: tenant.id,
        },
    });
    console.log(`Ensured Brand: ${brand.name}`);

    // 3. Upsert a Branch
    const branch = await prisma.branch.upsert({
        where: { code: 'MAIN-01' },
        update: {},
        create: {
            name: 'Main Store',
            code: 'MAIN-01',
            brandId: brand.id,
            tenantId: tenant.id,
        },
    });
    console.log(`Ensured Branch: ${branch.name}`);

    // 4. Upsert an Auditor User
    const hashedPassword = await bcrypt.hash('admin', 10);
    const user = await prisma.user.upsert({
        where: { email: 'admin@kamakapparel.store' },
        update: { password: hashedPassword },
        create: {
            email: 'admin@kamakapparel.store',
            password: hashedPassword,
            firstName: 'Demo',
            lastName: 'Auditor',
            tenantId: tenant.id,
        },
    });
    console.log(`Ensured User: ${user.email}`);

    // 5. Upsert a Location (This is what the user scans)
    // Location doesn't use a single unique string for query, we findFirst
    let location = await prisma.location.findFirst({ where: { code: 'LOC-A1' } });
    if (!location) {
        location = await prisma.location.create({
            data: {
                code: 'LOC-A1',
                qrValue: 'LOC-A1',
                branchId: branch.id,
            },
        });
    }
    console.log(`Ensured Location/Scan Code: ${location.code}`);

    // 6. Create an Audit Event (always create a new one to ensure it's open for testing)
    const audit = await prisma.audit.create({
        data: {
            name: `E2E Test Audit ${Date.now()}`,
            status: 'IN_PROGRESS',
            tenantId: tenant.id,
            branchId: branch.id,
        },
    });
    console.log(`Created Audit: ${audit.name}`);

    // 7. Create an Audit Section (Links Audit to Location)
    const section = await prisma.auditSection.create({
        data: {
            auditId: audit.id,
            locationId: location.id,
            assignedUserId: user.id, // Assign specifically to this auditor
            status: 'OPEN',
        },
    });
    console.log(`Created Assigned Audit Section (Status: OPEN)`);

    // 8. Create an Audit Assignment record (Optional but good for completeness)
    await prisma.auditAssignment.create({
        data: {
            auditId: audit.id,
            userId: user.id,
        },
    });
    console.log(`Linked Auditor to Audit via Assignment`);

    console.log('✅ Seeding complete! You can now log into the mobile app with admin@kamakapparel.store / admin');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
