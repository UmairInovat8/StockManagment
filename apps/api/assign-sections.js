const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function fix() {
    try {
        const user = await prisma.user.findFirst({ where: { email: 'auditor1@athgadlang.com' } });
        const audit = await prisma.audit.findFirst({ where: { status: 'DRAFT' } });

        if (!user || !audit) {
            console.log(`Missing user (${!!user}) or DRAFT audit (${!!audit})`);
            return;
        }

        console.log(`Targeting Audit: "${audit.name}" (${audit.id})`);

        // Ensure sections exist
        let sections = await prisma.auditSection.findMany({ where: { auditId: audit.id } });
        if (sections.length === 0) {
            console.log('No sections in this audit. Generating some...');
            const locs = await prisma.location.findMany({ where: { branchId: audit.branchId }, take: 5 });
            if (locs.length > 0) {
                await prisma.auditSection.createMany({
                    data: locs.map(l => ({ auditId: audit.id, locationId: l.id, status: 'OPEN' }))
                });
                sections = await prisma.auditSection.findMany({ where: { auditId: audit.id } });
            } else {
                console.log('No locations in branch. Cannot generate sections.');
                return;
            }
        }

        // Assign first 3 sections to auditor1
        const sectionIds = sections.slice(0, 3).map(s => s.id);
        await prisma.auditSection.updateMany({
            where: { id: { in: sectionIds } },
            data: { assignedUserId: user.id }
        });

        console.log(`Successfully assigned ${sectionIds.length} sections to ${user.email}`);

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

fix();
