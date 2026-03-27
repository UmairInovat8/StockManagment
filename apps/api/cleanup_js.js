
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function cleanup() {
    console.log('Cleaning up all stuck import jobs (JS)...');
    try {
        const result = await prisma.importJob.updateMany({
            where: { status: { in: ['STARTING', 'PROCESSING'] } },
            data: { status: 'FAILED', message: 'Manual cleanup by system' }
        });
        console.log(`Cleaned up ${result.count} jobs.`);
    } catch (err) {
        console.error('Cleanup failed:', err.message);
    } finally {
        await prisma.$disconnect();
    }
}
cleanup();
