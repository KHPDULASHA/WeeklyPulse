import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.role.upsert({
    where: { role_name: 'team_member' },
    update: {},
    create: { role_name: 'team_member' }
  });

  await prisma.role.upsert({
    where: { role_name: 'manager' },
    update: {},
    create: { role_name: 'manager' }
  });

  await prisma.project.upsert({
    where: { project_name: 'Platform Refresh' },
    update: {},
    create: {
      project_name: 'Platform Refresh',
      description: 'Modernize the delivery experience',
      status: 'active'
    }
  });

  await prisma.project.upsert({
    where: { project_name: 'Client Insights' },
    update: {},
    create: {
      project_name: 'Client Insights',
      description: 'Launch the new analytics workspace',
      status: 'active'
    }
  });

  console.log('Seeded roles and projects successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
