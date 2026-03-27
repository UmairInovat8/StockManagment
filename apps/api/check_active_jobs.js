const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    const activeJobs = await prisma.importJob.findMany({
        where: { status: { in: ['STARTING', 'PROCESSING'] } },
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(activeJobs, null, 2));
    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
