
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
    const jobs = await prisma.importJob.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    });
    console.log(JSON.stringify(jobs, null, 2));
    await prisma.$disconnect();
}
check();
