const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'admin@kamakapparel.store' }
        });
        if (!user) {
            console.log('User not found!');
            return;
        }
        console.log('Found User:', user.id, user.email);

        const assignments = await prisma.auditSection.findMany({
            where: { assignedUserId: user.id },
            include: { location: true, audit: true }
        });

        console.log('Assignments count for this user:', assignments.length);
        assignments.forEach(a => {
            console.log(`- Audit: ${a.audit.name}, Location: ${a.location.code}, Status: ${a.status}`);
        });

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
