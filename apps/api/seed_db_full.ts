import { PrismaClient } from './src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  try {
    console.log('--- RE-SEEDING AUTH SYSTEM ---');
    
    // 1. Clean up existing (in case of partial seed)
    await prisma.userRole.deleteMany({});
    await prisma.rolePermission.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.tenant.deleteMany({});

    // 2. Create Tenant
    const tenant = await prisma.tenant.create({
      data: {
        companyName: 'Unified Audit Corp',
        companyCode: 'AUDIT-CORP',
      }
    });

    // 3. Create Role
    const role = await prisma.role.create({
      data: {
        name: 'AuditManager',
        tenantId: tenant.id
      }
    });

    // 4. Create User
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const user = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Administrator',
        tenantId: tenant.id,
        roles: {
          create: {
            roleId: role.id
          }
        }
      }
    });

    console.log('Login Email: admin@example.com');
    console.log('Login Pass:  admin123');
    console.log('Tenant ID:   ', tenant.id);
    console.log('Role Created:', role.name);
    
  } catch (e) {
    console.error('Failed to seed DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
