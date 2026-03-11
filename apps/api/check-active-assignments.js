const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const activeAudits = await prisma.audit.findMany({
            where: { status: { in: ['DRAFT', 'IN_PROGRESS'] } },
            select: { id: true, name: true, status: true }
        });

        console.log('ACTIVE_AUDITS:', activeAudits.length);
        for (const audit of activeAudits) {
            const assignedCount = await prisma.auditSection.count({
                where: { auditId: audit.id, assignedUserId: { not: null } }
            });
            console.log(`Audit: "${audit.name}" (${audit.status}) | Assigned Sections: ${assignedCount}`);

            if (assignedCount > 0) {
                const assignments = await prisma.auditSection.findMany({
                    where: { auditId: audit.id, assignedUserId: { not: null } },
                    include: { assignedUser: { select: { email: true } } }
                });
                assignments.forEach(a => {
                    console.log(`  - Assigned to: ${a.assignedUser.email}`);
                });
            }
        }

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
