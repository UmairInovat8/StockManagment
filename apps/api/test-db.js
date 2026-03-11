const { PrismaClient } = require('./src/generated/prisma-client/index.js');

async function testConnection() {
    console.log('Starting diagnostic...');
    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: "postgresql://postgres:password@localhost:5432/stockcount?schema=public"
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
        process.exit(1);
    }
}

testConnection().catch(err => {
    console.error('Fatal error during execution:', err);
    process.exit(1);
});
