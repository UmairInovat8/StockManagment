const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkCounts() {
  const events = await prisma.countEvent.findMany({
    orderBy: { scannedAt: 'desc' },
    take: 10,
    include: { item: true }
  });
  console.log('Recent Count Events:');
  console.log(JSON.stringify(events, null, 2));

  const totals = await prisma.sectionItemTotal.findMany({
    take: 10,
    include: { item: true }
  });
  console.log('\nRecent Section Totals:');
  console.log(JSON.stringify(totals, null, 2));
}

checkCounts().catch(console.error).finally(() => prisma.$disconnect());
