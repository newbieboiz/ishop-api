import { z } from 'zod';

export const CheckoutPayloadSchema = z.object({
  customerName: z.string({ required_error: 'customerName is required!' }).max(64),
  customerPhone: z.string({ required_error: 'customerPhone is required!' }).max(12),
  addressLine: z.string({ required_error: 'addressLine is required!' }).max(128),
  addressId: z.string({ required_error: 'addressId is required!' }),
  note: z.string().max(256).optional(),
  items: z
    .object({
      SKU: z.string({ required_error: 'SKU is required!' }),
      qty: z.number().int('qty should be integer'),
    })
    .array()
    .min(1),
});

export type CheckoutPayload = z.infer<typeof CheckoutPayloadSchema>;
