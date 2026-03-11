const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const user = await prisma.user.findFirst({ where: { email: 'auditor1@athgadlang.com' } });
        if (!user) { console.log('User not found'); return; }

        const assignments = await prisma.auditSection.findMany({
            where: {
                assignedUserId: user.id,
                status: { not: 'COMPLETED' },
                audit: {
                    status: { not: 'COMPLETED' }
                }
            },
            include: {
                audit: true,
                location: true
            }
        });

        console.log('API_MOCK_RESPONSE:', JSON.stringify(assignments, null, 2));

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
