import { PrismaClient } from './src/generated/prisma-client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- DB DIAGNOSTIC ---');
    const auditor = await prisma.user.findFirst({ where: { email: 'manager@athgadlang.com' } });
    console.log('Manager:', auditor ? { id: auditor.id, tenantId: auditor.tenantId } : 'Not Found');

    const audits = await prisma.audit.findMany({
        select: { id: true, name: true, tenantId: true }
    });
    console.log('Audits:', JSON.stringify(audits, null, 2));

    const tenants = await prisma.tenant.findMany({ select: { id: true, name: true } });
    console.log('Tenants:', JSON.stringify(tenants, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
