import { z } from 'zod';

// Shop
export const ShopPayloadSchema = z.object({
  slug: z.string({ invalid_type_error: 'Required slug' }).min(1, 'Invalid slug').max(32, 'Invalid slug'),
  name: z.string({ invalid_type_error: 'Required name' }).min(1, 'Invalid name').max(32, 'Invalid name'),
});
export type ShopPayload = z.infer<typeof ShopPayloadSchema>;

// Billboard
export const BillboardPayloadSchema = z.object({
  heading: z.string({ invalid_type_error: 'Required heading' }).min(1, 'Invalid heading'),
  subheading: z.string().optional(),
  imageUrl: z.string({ invalid_type_error: 'Required imageUrl' }).min(1, 'Invalid imageUrl'),
});
export type BillboardPayload = z.infer<typeof BillboardPayloadSchema>;

// Brand
export const BrandPayloadSchema = z.object({
  name: z.string({ invalid_type_error: 'Required name' }).min(1, 'Invalid name'),
  description: z.string().optional(),
});
export type BrandPayload = z.infer<typeof BrandPayloadSchema>;

// Address
export const WardSchema = z.object({
  code: z.string(),
  name: z.string(),
});

export const DistrictSchema = z.object({
  code: z.string(),
  name: z.string(),
  wards: z.array(WardSchema),
});

export const ProvinceSchema = z.object({
  code: z.string(),
  name: z.string(),
  districts: z.array(DistrictSchema),
});

export const ImportProvincesPayloadSchema = z.object({
  provinces: z.array(ProvinceSchema),
});
export type ImportProvincesPayload = z.infer<typeof ImportProvincesPayloadSchema>;

export const AddressPayloadSchema = z.object({
  name: z.string({ invalid_type_error: 'Required name' }).min(1, 'Invalid name'),
  addressLine: z.string({ invalid_type_error: 'Required addressLine' }).min(1, 'Invalid addressLine'),
  wardCode: z.string({ invalid_type_error: 'Required wardCode' }).min(1, 'Invalid wardCode'),
  districtCode: z.string({ invalid_type_error: 'Required districtCode' }).min(1, 'Invalid districtCode'),
  provinceCode: z.string({ invalid_type_error: 'Required provinceCode' }).min(1, 'Invalid provinceCode'),
});
export type AddressPayload = z.infer<typeof AddressPayloadSchema>;

// Category
export const CategoryPayloadSchema = z.object({
  name: z.string({ invalid_type_error: 'Required name' }).min(2, 'Invalid name'),
  parentCategoryId: z.string().optional(),
});
export type CategoryPayload = z.infer<typeof CategoryPayloadSchema>;

// ShoppingCart
export const AddToCartPayloadSchema = z.object({
  shoppingCartId: z.string({ invalid_type_error: 'Required shoppingCartId' }).min(1, 'Invalid productItemId'),
  productItemId: z.string({ invalid_type_error: 'Required productItemId' }).min(1, 'Invalid productItemId'),
  qty: z.number({ invalid_type_error: 'Required qty' }).int('Invalid qty').min(1, 'Invalid qty'),
});
export const RemoveToCartPayloadSchema = AddToCartPayloadSchema.omit({ qty: true });

export type AddToCartPayload = z.infer<typeof AddToCartPayloadSchema>;
export type RemoveToCartPayload = z.infer<typeof RemoveToCartPayloadSchema>;
