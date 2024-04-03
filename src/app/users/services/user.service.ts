import { User } from '@prisma/client';

import { roles } from '@/common/constants';
import { NotFoundException } from '@/common/exceptions';
import db from '@/lib/database';
import { exclude } from '@/lib/utils/exclude';

import { SignUpPayload } from '../schemas';

export class UserService {
  public findMany = async () => {
    const users = await db.user.findMany({
      select: {
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        id: true,
        email: true,
        emailVerified: true,
        image: true,
        username: true,
        role: true,
        isTwoFactorEnabled: true,
      },
    });

    return users;
  };

  public findUnique = async (id: string) => {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return exclude(user, ['password']);
  };

  public findByEmail = async (email: string) => {
    return await db.user.findUnique({ where: { email } });
  };

  public findRole = async (name: string = roles.MODERATOR) => {
    const role = await db.role.findUnique({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    return role;
  };

  public create = async (user: Omit<SignUpPayload, 'confirmPassword'>) => {
    const role = await this.findRole(roles.MODERATOR);
    return await db.user.create({
      data: {
        ...user,
        roleId: role.id,
      },
    });
  };

  public update = async (id: string, user: Partial<Omit<User, 'id'>>) => {
    return await db.user.update({
      where: { id },
      data: user,
    });
  };
}
