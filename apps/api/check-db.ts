import { PrismaClient } from './src/generated/prisma-client';

async function main() {
    const prisma = new PrismaClient();
    try {
        console.log('--- SEARCHING FOR SKU-1978 ---');
        const specificItem = await prisma.item.findFirst({
            where: { sku: 'SKU-1978' }
        });
        console.log('Item SKU-1978:', specificItem ? JSON.stringify(specificItem, null, 2) : 'NOT FOUND');

        const allItems = await prisma.item.findMany({
            select: { sku: true, name: true, id: true },
            take: 100
        });

        console.log('\n--- ALL AVAILABLE SKUs (First 100) ---');
        allItems.forEach(i => {
            console.log(`SKU: ${i.sku}, ID: ${i.id}, Name: ${i.name}`);
        });

        const counts = await prisma.countEvent.count();
        console.log(`\nTotal CountEvents in DB: ${counts}`);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
