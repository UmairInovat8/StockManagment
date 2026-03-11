const { PrismaClient } = require('./src/generated/prisma-client/index.js');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function updateCredentials() {
    try {
        // 1. Update manager@athgadlang.com password to "admin"
        const hashedAdmin = await bcrypt.hash('admin', 10);
        const updated = await prisma.user.update({
            where: { email: 'manager@athgadlang.com' },
            data: { password: hashedAdmin }
        });
        console.log('✅ Updated manager@athgadlang.com password to "admin"');

        // 2. Check if admin@kamakapparel.store exists
        const existing = await prisma.user.findUnique({ where: { email: 'admin@kamakapparel.store' } });
        if (!existing) {
            // Get the athgadlang Global tenant
            const tenant = await prisma.tenant.findFirst({ where: { name: 'athgadlang Global' } });
            const role = await prisma.role.findFirst({ where: { tenantId: tenant.id, name: 'AuditManager' } });
            const branch = await prisma.branch.findFirst({ where: { tenantId: tenant.id } });

            await prisma.user.create({
                data: {
                    email: 'admin@kamakapparel.store',
                    password: hashedAdmin,
                    firstName: 'Admin',
                    lastName: 'Kamak',
                    tenantId: tenant.id,
                    roles: { create: { roleId: role.id } },
                    branchAccess: branch ? { create: { branchId: branch.id } } : undefined,
                }
            });
            console.log('✅ Created admin@kamakapparel.store with password "admin"');
        } else {
            await prisma.user.update({
                where: { email: 'admin@kamakapparel.store' },
                data: { password: hashedAdmin }
            });
            console.log('✅ Updated admin@kamakapparel.store password to "admin"');
        }

    } catch (e) {
        console.error('❌ Error:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateCredentials();
