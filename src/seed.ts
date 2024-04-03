import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { parseArgs } from 'util';

import { roles } from './common/constants';

const prisma = new PrismaClient();

async function main() {
  const {
    values: { environment },
  } = parseArgs({
    options: {
      environment: { type: 'string' },
    },
  });

  switch (environment) {
    case 'development': {
      /** data for your development */
      const adminRole = await prisma.role.upsert({
        where: { name: roles.ADMIN },
        update: {},
        create: {
          name: roles.ADMIN,
          permissions: {
            create: {
              action: 'manage',
              subject: 'all',
            },
          },
        },
      });

      const moderatorRole = await prisma.role.upsert({
        where: { name: roles.MODERATOR },
        update: {},
        create: {
          name: roles.MODERATOR,
          permissions: {
            createMany: {
              data: [
                { action: 'manage', subject: 'Store', conditions: { id: '${ownId}' } },
                { action: 'manage', subject: 'Billboard', conditions: { id: '${ownId}' } },
                { action: 'manage', subject: 'Category', conditions: { id: '${ownId}' } },
                { action: 'manage', subject: 'Product', conditions: { id: '${ownId}' } },
                { action: 'manage', subject: 'Brand', conditions: { id: '${ownId}' } },
                { action: 'manage', subject: 'Size', conditions: { id: '${ownId}' } },
                { action: 'manage', subject: 'Color', conditions: { id: '${ownId}' } },
              ],
            },
          },
        },
      });

      const salt = await bcrypt.genSalt(12);
      const adminPassword = await bcrypt.hash('@pw00000', salt);
      const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
          email: 'admin@gmail.com',
          username: 'admin',
          password: adminPassword,
          roleId: adminRole.id,
          emailVerified: new Date(),
        },
      });

      break;
    }

    case 'test': {
      /** data for your test environment */
      break;
    }

    default:
      break;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
