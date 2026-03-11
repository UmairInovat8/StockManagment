import { PrismaClient } from './src/generated/prisma-client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, tenantId: true }
    });
    fs.writeFileSync('users-list.json', JSON.stringify(users, null, 2));
    console.log('Done');
}

main().catch(console.error).finally(() => prisma.$disconnect());
