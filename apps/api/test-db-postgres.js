const { PrismaClient } = require('./src/generated/prisma-client/index.js');

async function testConnection() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://postgres:admin1234@localhost:5432/stockcount?schema=public"
            }
        }
    });

    try {
        await prisma.$connect();
        console.log('✅ Connection to "postgres" DB successful!');
        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error Code:', error.code);
        console.error('Message:', error.message);
        process.exit(1);
    }
}

testConnection();
