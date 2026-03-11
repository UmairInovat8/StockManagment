const { PrismaClient } = require('./src/generated/prisma-client/index.js');

async function check(pw) {
    const url = `postgresql://postgres:${pw}@localhost:5432/stockcount?schema=public`;
    const prisma = new PrismaClient({
        datasources: { db: { url } }
    });
    try {
        await prisma.$connect();
        console.log(`SUCCESS: Password is "${pw}"`);
        await prisma.$disconnect();
        return true;
    } catch (e) {
        // console.log(`FAILED: "${pw}" - ${e.code}`);
        await prisma.$disconnect();
        return false;
    }
}

async function main() {
    const pws = ['password', 'postgres', 'root', 'admin', 'athgadlang123', 'athgadlang', 'manager', 'audit', '123456', '1234', ''];
    for (const pw of pws) {
        if (await check(pw)) process.exit(0);
    }
    console.log('None of the tested passwords worked.');
    process.exit(1);
}

main();
