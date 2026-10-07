import { z } from "zod";

const cartItemSnapshotSchema = z
  .object({
    productName: z.string().min(1).max(200),
    sku: z.string().min(1).max(100),
    brandName: z.string().min(1).max(100),
    variantLabel: z.string().min(1).max(200),
    paymentLabel: z.string().min(1).max(200).optional(),
  })
  .strict();

export const cartItemSchema = z
  .object({
    productId: z.string().min(1).max(100),
    variantId: z.string().min(1).max(100),
    quantity: z.number().int().min(1).max(99),
    selectedOptions: z.record(z.string().min(1).max(100), z.string().min(1).max(100)),
    snapshot: cartItemSnapshotSchema,
  })
  .strict();

export const cartStorageSchema = z
  .object({
    version: z.literal(1),
    items: z.array(cartItemSchema),
  })
  .strict();
