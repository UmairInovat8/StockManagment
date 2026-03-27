import { PrismaClient } from './src/generated/prisma-client';

async function main() {
  const prisma = new PrismaClient();
  try {
    const logs = await prisma.errorLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log('--- ERROR LOGS ---');
    console.dir(logs, { depth: null });
    
    const jobs = await prisma.importJob.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });
    console.log('--- IMPORT JOBS ---');
    console.dir(jobs, { depth: null });
    
  } catch (e) {
    console.error('Failed to query DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
