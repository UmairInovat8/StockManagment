import { PrismaClient } from './src/generated/prisma-client';
import fs from 'fs';

const prisma = new PrismaClient();

async function main() {
    const audits = await prisma.audit.findMany({
        select: { id: true, name: true, tenantId: true }
    });
    fs.writeFileSync('audits-list.json', JSON.stringify(audits, null, 2));
    console.log('Done');
}

main().catch(console.error).finally(() => prisma.$disconnect());
