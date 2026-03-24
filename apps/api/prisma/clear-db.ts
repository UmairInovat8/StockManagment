import { PrismaClient } from '../src/generated/prisma-client';

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing database of item-related data...');

    // Delete in reverse order of dependencies
    await prisma.itemIdentifier.deleteMany();
    await prisma.sectionItemTotal.deleteMany();
    await prisma.countEvent.deleteMany();
    await prisma.discrepancyCase.deleteMany();
    await prisma.varianceTotal.deleteMany();
    await prisma.auditSohBaseline.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.auditAssignment.deleteMany();
    await prisma.auditSection.deleteMany();
    await prisma.report.deleteMany();
    await prisma.clientSignoff.deleteMany();
    await prisma.internalSignoff.deleteMany();
    await prisma.notificationLog.deleteMany();
    await prisma.audit.deleteMany();
    await prisma.item.deleteMany();
    
    // Optional: clear locations/branches/brands if needed
    // await prisma.location.deleteMany();
    // await prisma.branch.deleteMany();
    // await prisma.brand.deleteMany();

    console.log('Database cleared successfully!');
}

main()
    .catch((e) => {
        console.error('Error clearing database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
