const { PrismaClient } = require('./src/generated/prisma-client');
const p = new PrismaClient();
async function run() {
  const branches = await p.branch.findMany({
    include: { _count: { select: { locations: true } } }
  });
  console.log('Branches:');
  branches.forEach(b => console.log('  ' + b.name + ' (' + b.id + ') - locations: ' + b._count.locations));
  
  const audits = await p.audit.findMany({
    include: { branch: true }
  });
  console.log('\nAudits:');
  audits.forEach(a => console.log('  ' + a.name + ' -> Branch: ' + (a.branch?.name || 'none')));
}
run().catch(console.error).finally(() => p.$disconnect());
