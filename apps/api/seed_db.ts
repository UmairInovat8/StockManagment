import { PrismaClient } from './src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

async function main() {
  const prisma = new PrismaClient();
  try {
    const tenants = await prisma.tenant.findMany();
    console.log('--- TENANTS ---');
    console.dir(tenants, { depth: null });
    
    if (tenants.length === 0) {
      console.log('Database is empty. Seeding default admin...');
      const tenant = await prisma.tenant.create({
        data: {
          companyName: 'Default Tenant',
          companyCode: 'DEFAULT',
        }
      });
      
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const user = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          tenantId: tenant.id
        }
      });
      console.log('Seed successful. Tenant:', tenant.id, 'User:', user.email);
    }
    
  } catch (e) {
    console.error('Failed to query/seed DB:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
