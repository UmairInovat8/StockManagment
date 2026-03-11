import { PrismaClient } from './src/generated/prisma-client';
import axios from 'axios';
import fs from 'fs';

const prisma = new PrismaClient();
const log = (msg: string) => { console.log(msg); fs.appendFileSync('e2e-test.log', msg + '\n'); };

async function main() {
    fs.writeFileSync('e2e-test.log', '=== E2E Audit Detail + Assignment Test ===\n');

    // 1. Login as manager@athgadlang.com
    let token: string;
    try {
        const res = await axios.post('http://localhost:3001/auth/login', {
            email: 'manager@athgadlang.com',
            password: 'athgadlang123'
        });
        token = res.data.access_token;
        log(`LOGIN OK: tenantId from user obj = ${JSON.stringify(res.data.user)}`);
    } catch (e: any) {
        log(`LOGIN FAILED: ${JSON.stringify(e.response?.data || e.message)}`);
        return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // 2. Fetch audits list
    let audits: any[];
    try {
        const res = await axios.get('http://localhost:3001/audits', { headers });
        audits = res.data;
        log(`AUDITS LIST: found ${audits.length} audits`);
        if (!audits.length) { log('NO AUDITS - create one first'); return; }
        audits.slice(0, 3).forEach((a: any) => log(`  - ${a.id} | ${a.name} | tenant=${a.tenantId}`));
    } catch (e: any) {
        log(`AUDITS LIST FAILED: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        return;
    }

    // 3. Fetch first audit detail
    const firstAudit = audits[0];
    let auditDetail: any;
    try {
        const res = await axios.get(`http://localhost:3001/audits/${firstAudit.id}`, { headers });
        auditDetail = res.data;
        log(`AUDIT DETAIL OK: ${auditDetail?.name}, sections=${auditDetail?.sections?.length}`);
    } catch (e: any) {
        log(`AUDIT DETAIL FAILED: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        return;
    }

    // 4. Fetch users
    let users: any[];
    try {
        const res = await axios.get('http://localhost:3001/users', { headers });
        users = res.data;
        log(`USERS OK: found ${users.length} users`);
        users.slice(0, 3).forEach((u: any) => log(`  - ${u.id} | ${u.firstName} ${u.lastName}`));
    } catch (e: any) {
        log(`USERS FAILED: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        users = [];
    }

    // 5. Generate sections if none exist
    if (!auditDetail?.sections?.length) {
        log('No sections - generating...');
        try {
            await axios.post(`http://localhost:3001/audits/${firstAudit.id}/generate-sections`, {}, { headers });
            const res2 = await axios.get(`http://localhost:3001/audits/${firstAudit.id}`, { headers });
            auditDetail = res2.data;
            log(`GENERATE SECTIONS OK: now ${auditDetail?.sections?.length} sections`);
        } catch (e: any) {
            log(`GENERATE SECTIONS FAILED: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        }
    }

    // 6. Assign an auditor to first section
    if (auditDetail?.sections?.length && users.length) {
        const section = auditDetail.sections[0];
        const auditorUser = users.find((u: any) => u.roles?.some((r: any) => r.role?.name === 'Auditor')) || users[0];
        log(`Assigning user ${auditorUser.firstName} ${auditorUser.lastName} to section ${section.id}...`);
        try {
            await axios.patch(`http://localhost:3001/audits/sections/${section.id}/assign`,
                { userId: auditorUser.id },
                { headers }
            );
            log(`ASSIGN OK! Section assigned successfully`);
        } catch (e: any) {
            log(`ASSIGN FAILED: ${e.response?.status} ${JSON.stringify(e.response?.data)}`);
        }
    } else {
        log(`CANNOT ASSIGN: sections=${auditDetail?.sections?.length}, users=${users.length}`);
    }

    log('=== TEST COMPLETE ===');
}

main().catch(e => { console.error(e); fs.appendFileSync('e2e-test.log', `EXCEPTION: ${e}\n`); }).finally(() => prisma.$disconnect());
