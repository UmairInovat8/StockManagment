const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.user.count({ where: { email: 'smith@athgadlang.com' } });
        console.log('USER_COUNT:', count);
    } catch (e) {
        console.error('ERROR:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
