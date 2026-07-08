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

  console.log('Seeded roles successfully.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
