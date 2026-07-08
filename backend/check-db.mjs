import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

try {
  const [users, projects, reports, roles] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.weeklyReport.count(),
    prisma.role.count()
  ]);

  console.log(JSON.stringify({ users, projects, reports, roles }, null, 2));
} finally {
  await prisma.$disconnect();
}
