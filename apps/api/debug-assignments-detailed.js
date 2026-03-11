const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const user = await prisma.user.findFirst({ where: { email: 'auditor1@athgadlang.com' } });
        if (!user) { console.log('User not found'); return; }

        const assignments = await prisma.auditSection.findMany({
            where: { assignedUserId: user.id, audit: { status: 'DRAFT' } },
            include: { location: true, audit: true }
        });

        console.log(`User: ${user.email} (${user.id})`);
        console.log(`Assignments Found: ${assignments.length}`);

        assignments.forEach(a => {
            console.log('--- Assignment ---');
            console.log('Content:', JSON.stringify(a, null, 2));
        });

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
