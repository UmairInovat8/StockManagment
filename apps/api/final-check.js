const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const user = await prisma.user.findFirst({ where: { email: 'auditor1@athgadlang.com' } });
        const assignments = await prisma.auditSection.findMany({
            where: {
                assignedUserId: user.id,
                status: { not: 'COMPLETED' },
                audit: {
                    status: { not: 'COMPLETED' }
                }
            },
            include: { audit: true }
        });

        console.log(`Assignments Found (Filtered): ${assignments.length}`);
        assignments.forEach(a => {
            console.log(`- Audit: ${a.audit.name} | Status: ${a.audit.status}`);
        });

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
