const { PrismaClient } = require('./src/generated/prisma-client');
const p = new PrismaClient();
async function run() {
  const locs = await p.location.findMany();
  let count = 0;
  for (let l of locs) {
    if (!l.name || l.name.trim() === '') {
      await p.location.update({where: {id: l.id}, data: {name: 'Location ' + (l.code || l.id.substring(0,4))}});
      count++;
    }
  }
  console.log('Fixed ' + count + ' empty location names. Total locations: ' + locs.length);
}
run().catch(console.error).finally(() => p.$disconnect());
