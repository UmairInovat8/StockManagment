const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- LATEST 10 IMPORT JOBS ---');
    const jobs = await prisma.importJob.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
    });
    
    jobs.forEach(job => {
        console.log(`ID: ${job.id} | Status: ${job.status} | Total: ${job.total} | Processed: ${job.processed} | Msg: ${job.message} | Updated: ${job.updatedAt}`);
    });

    const activeJobs = await prisma.importJob.findMany({
        where: { status: { in: ['STARTING', 'PROCESSING'] } }
    });
    console.log('\n--- ACTIVE JOBS ---');
    activeJobs.forEach(job => {
        console.log(`ID: ${job.id} | Status: ${job.status} | Total: ${job.total} | Processed: ${job.processed} | Updated: ${job.updatedAt}`);
    });

    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
