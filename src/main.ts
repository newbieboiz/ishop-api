import 'module-alias/register';

import * as dotenv from 'dotenv';
dotenv.config();

import { OrderController } from '@/app/orders/controllers/order.controller';
import { PaymentController } from '@/app/payments/controllers/payment.controller';
import { ProductItemController, VariantController } from '@/app/products';
import { ProductController } from '@/app/products/controllers/product.controller';
import {
  AddressController,
  BillboardController,
  BrandController,
  CategoryController,
  ShopController,
  ShoppingCartController,
} from '@/app/shops';
import { AuthController } from '@/app/users/controllers/auth.controller';
import { UserController } from '@/app/users/controllers/user.controller';

import { App } from './app';

const app = new App([
  new AuthController(),
  new UserController(),
  new ShopController(),
  new ShoppingCartController(),
  new AddressController(),
  new BillboardController(),
  new BrandController(),
  new CategoryController(),
  new VariantController(),
  new ProductController(),
  new ProductItemController(),
  new OrderController(),
  new PaymentController(),
]);

app.listen();
