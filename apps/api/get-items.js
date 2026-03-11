const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const items = await prisma.item.findMany({ take: 5 });
        console.log('ITEMS_JSON:' + JSON.stringify(items));
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
