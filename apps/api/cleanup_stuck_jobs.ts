
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function cleanup() {
    console.log('Cleaning up all stuck import jobs...');
    const result = await prisma.importJob.updateMany({
        where: { status: { in: ['STARTING', 'PROCESSING'] } },
        data: { status: 'FAILED', message: 'Manual cleanup by system' }
    });
    console.log(`Cleaned up ${result.count} jobs.`);
    await prisma.$disconnect();
}
cleanup();
