const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const audits = await prisma.audit.findMany({
            where: { status: { not: 'COMPLETED' } },
            include: { _count: { select: { sections: true } } }
        });

        console.log(`Open Audits Found: ${audits.length}`);
        audits.forEach(a => {
            console.log(`Audit: "${a.name}" | Status: "${a.status}" | Sections: ${a._count.sections}`);
        });

    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
