const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    const jobs = await prisma.importJob.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    
    jobs.forEach((job, i) => {
        console.log(`--- JOB ${i+1} ---`);
        console.log(`ID: ${job.id}`);
        console.log(`Status: ${job.status}`);
        console.log(`Summary: ${job.processed}/${job.total} (Failed: ${job.failed})`);
        console.log(`Message: ${job.message}`);
        console.log(`Created: ${job.createdAt}`);
        console.log(`Updated: ${job.updatedAt}`);
        console.log('----------------\n');
    });

    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
