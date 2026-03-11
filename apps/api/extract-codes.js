const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const user = await prisma.user.findFirst({ where: { email: 'auditor1@athgadlang.com' } });
        const assignments = await prisma.auditSection.findMany({
            where: { assignedUserId: user.id, status: { not: 'COMPLETED' }, audit: { status: { not: 'COMPLETED' } } },
            include: { location: true }
        });

        console.log('--- ASSIGNMENTS ---');
        assignments.forEach(a => {
            console.log(`CODE:[${a.location.code}]`);
        });

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
