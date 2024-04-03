import { z } from 'zod';

// Product
export const ProductItemPayloadSchema = z.object({
  SKU: z.string({ required_error: 'SKU is required' }).length(12, 'Invalid SKU'),
  qtyInStock: z.number().int('qtyInStock should be integer'),
  imageUrl: z.string().optional(),
  configurations: z.array(
    z.object({
      variantOptionId: z.string(),
    }),
  ),
  price: z.number({ required_error: 'Price is required' }).positive('Invalid price'),
});
export type ProductItemPayload = z.infer<typeof ProductItemPayloadSchema>;

export const ProductPayloadSchema = z.object({
  categoryId: z.string({ required_error: 'categoryId is required' }),
  brandId: z.string({ required_error: 'brandId is required' }),
  name: z.string({ required_error: 'name is required' }).min(1, 'Invalid name'),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean().default(false),
  productItems: z.array(ProductItemPayloadSchema).optional(),
});

export type ProductPayload = z.infer<typeof ProductPayloadSchema>;

// Variant
export const VariantPayloadSchema = z.object({
  name: z
    .string({ invalid_type_error: 'Required name' })
    .min(1, 'Variant name is too short')
    .max(32, 'Variant name is too long'),
  options: z.array(
    z.object({
      label: z
        .string({ invalid_type_error: 'Required label' })
        .min(1, 'Label is too short')
        .max(32, 'Label is too long'),
      value: z
        .string({ invalid_type_error: 'Required value' })
        .min(1, 'Value is too short')
        .max(16, 'Value is too long'),
    }),
  ),
});
export type VariantPayload = z.infer<typeof VariantPayloadSchema>;
