import { createMongoAbility, PureAbility, RawRuleOf } from '@casl/ability';
import { PrismaQuery, Subjects } from '@casl/prisma';
import { Billboard, Brand, Category, Order, Product, Shop, User } from '@prisma/client';

import { roles } from '@/common/constants';

export const actions = ['manage', 'create', 'read', 'update', 'delete'] as const;

export type Action = (typeof actions)[number];
export type AppSubject =
  | 'all'
  | Subjects<{
      User: User;
      Shop: Shop;
      Billboard: Billboard;
      Brand: Brand;
      Category: Category;
      Product: Product;
      Order: Order;
    }>;
export type AppAbility = PureAbility<[Action, AppSubject], PrismaQuery>;

export function defineAbilityFor(user: User) {
  return createAbility(definePermissionsFor(user));
}

export function createAbility(rules: RawRuleOf<AppAbility>[]) {
  return createMongoAbility<AppAbility>(rules);
}

export function definePermissionsFor(user: User): RawRuleOf<AppAbility>[] {
  return [
    {
      action: 'manage',
      subject: 'all',
      conditions: {
        role: {
          name: roles.ADMIN,
        },
      },
    },
    {
      action: 'read',
      subject: 'all',
      conditions: {
        role: {
          name: roles.MODERATOR,
        },
      },
    },
    {
      action: 'manage',
      subject: ['Shop', 'Billboard', 'Category', 'Product', 'Order'],
      conditions: {
        userId: user.id,
        role: {
          name: roles.MODERATOR,
        },
      },
    },
  ];
}
