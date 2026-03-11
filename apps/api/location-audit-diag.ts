import { PrismaClient } from './src/generated/prisma-client';
import axios from 'axios';
import fs from 'fs';

const prisma = new PrismaClient();
const log = (msg: string) => { console.log(msg); fs.appendFileSync('location-audit-diag.log', msg + '\n'); };

async function main() {
    fs.writeFileSync('location-audit-diag.log', '=== Location & User Diagnostic ===\n');

    // 1. Login
    const loginRes = await axios.post('http://localhost:3001/auth/login', {
        email: 'manager@athgadlang.com', password: 'athgadlang123'
    });
    const token = loginRes.data.access_token;
    const headers = { Authorization: `Bearer ${token}` };
    log(`Logged in. tenantId: ${loginRes.data.user?.id}`);

    // 2. Check audits and their branches
    const audits = await prisma.audit.findMany({
        where: { tenantId: 'ce6db3b8-074f-4d1e-a4c1-df2df688bd30' },
        include: { branch: true },
        take: 5,
    });
    log(`\nAudits (${audits.length}):`);
    for (const a of audits) {
        log(`  - ${a.name} | branch: ${a.branch?.name} (${a.branchId})`);
        // Check locations for this branch
        const locs = await prisma.location.findMany({ where: { branchId: a.branchId } });
        log(`    Locations in branch: ${locs.length}`);
        locs.slice(0, 3).forEach(l => log(`      • ${l.code} (QR: ${l.qrValue})`));
    }

    // 3. Check all branches and their location counts
    const branches = await prisma.branch.findMany({
        where: { tenantId: 'ce6db3b8-074f-4d1e-a4c1-df2df688bd30' },
        include: { _count: { select: { locations: true } } }
    });
    log(`\nAll Branches (${branches.length}):`);
    branches.forEach(b => log(`  - ${b.name} | locations: ${b._count.locations}`));

    // 4. Check users via API
    try {
        const usersRes = await axios.get('http://localhost:3001/users', { headers });
        log(`\nUsers via API: ${usersRes.data.length}`);
        usersRes.data.forEach((u: any) => log(`  - ${u.firstName} ${u.lastName} | roles: ${u.roles?.map((r: any) => r.role?.name).join(',')}`));
    } catch (e: any) {
        log(`Users API FAILED: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
    }

    // 5. Check all sections for manager's audits
    log('\nAudit Sections:');
    for (const a of audits.slice(0, 3)) {
        const sections = await prisma.auditSection.count({ where: { auditId: a.id } });
        log(`  ${a.name}: ${sections} sections`);
    }
}

main().catch(e => { fs.appendFileSync('location-audit-diag.log', `ERROR: ${e}\n`); console.error(e); }).finally(() => prisma.$disconnect());
