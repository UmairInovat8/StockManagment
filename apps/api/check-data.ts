import { PrismaClient } from './src/generated/prisma-client';
const prisma = new PrismaClient();
async function main() {
  const events = await prisma.countEvent.findMany();
  const sectionTotals = await prisma.sectionItemTotal.findMany();
  console.log('CountEvents:', events.length);
  console.log('SectionTotals:', sectionTotals.length);
  console.log('First SectionTotal:', sectionTotals[0]);
}
main().catch(console.error).finally(() => prisma.$disconnect());
