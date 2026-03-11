import { PrismaClient } from './src/generated/prisma-client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('athgadlang123', 10);
    await prisma.user.update({
        where: { email: 'manager@athgadlang.com' },
        data: { password }
    });
    console.log('Password reset for manager@athgadlang.com');
}

main().catch(console.error).finally(() => prisma.$disconnect());
