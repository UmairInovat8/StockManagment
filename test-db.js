const { PrismaClient } = require('./apps/api/src/generated/prisma-client');

async function testConnection() {
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/stockcount?schema=public"
            }
        }
    });

    console.log('Attempting to connect to:', prisma._activeDatasources.db.url);

    try {
        await prisma.$connect();
        console.log('✅ Connection successful!');
        await prisma.$disconnect();
    } catch (error) {
        console.error('❌ Connection failed:');
        console.error('Error Code:', error.code);
        console.error('Message:', error.message);
        if (error.meta) {
            console.error('Meta:', JSON.stringify(error.meta, null, 2));
        }
        process.exit(1);
    }
}

testConnection();
