const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    const jobs = await prisma.importJob.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(jobs, null, 2));
    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
