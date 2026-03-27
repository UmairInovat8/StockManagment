import { PrismaClient } from './src/generated/prisma-client';
const fs = require('fs');
const prisma = new PrismaClient();
prisma.importJob.findMany({ orderBy: { createdAt: 'desc' }, take: 1 })
  .then(jobs => { 
    if (jobs.length > 0) {
      fs.writeFileSync('job_error.txt', `Job Status: ${jobs[0].status}\nProcessed: ${jobs[0].processed}\nTotal: ${jobs[0].total}\nMessage:\n${jobs[0].message}`);
      console.log('Error written to job_error.txt');
    } else {
      console.log('No jobs found');
    }
    process.exit(0); 
  })
  .catch(e => { console.error(e); process.exit(1); });
