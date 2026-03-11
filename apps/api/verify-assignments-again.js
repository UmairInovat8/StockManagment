const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const user = await prisma.user.findFirst({ where: { email: 'auditor1@athgadlang.com' } });
        const assignments = await prisma.auditSection.findMany({
            where: { assignedUserId: user.id, audit: { status: 'DRAFT' } },
            include: { location: true, audit: true }
        });

        console.log(`Assignments for ${user.email}:`);
        assignments.forEach(a => {
            console.log(`- SectionID: ${a.id} | Location Code: "${a.location.code}" | Location Name: "${a.location.name}"`);
        });

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
