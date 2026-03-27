const { PrismaClient } = require('./src/generated/prisma-client');
const prisma = new PrismaClient();

async function main() {
    const result = await prisma.importJob.updateMany({
        where: { status: { in: ['STARTING', 'PROCESSING'] } },
        data: { status: 'FAILED', message: 'Reset: job cleared by admin to unblock new uploads.' }
    });
    console.log(`Reset ${result.count} stuck job(s).`);
    await prisma.$disconnect();
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
