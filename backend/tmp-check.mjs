import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const result = await prisma.$transaction([
  prisma.user.count(),
  prisma.weeklyReport.count(),
  prisma.project.count()
]);
console.log(JSON.stringify({ users: result[0], reports: result[1], projects: result[2] }));
await prisma.$disconnect();
