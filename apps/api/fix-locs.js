const { PrismaClient } = require('./src/generated/prisma-client');
const p = new PrismaClient();
async function run() {
  const locs = await p.location.findMany({where: {name: ''}});
  for (let l of locs) {
    if (l.code) {
      await p.location.update({where: {id: l.id}, data: {name: 'Location ' + l.code}});
    }
  }
  console.log('Fixed ' + locs.length + ' empty location names');
}
run().catch(console.error).finally(() => p.$disconnect());
