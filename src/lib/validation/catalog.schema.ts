import { z } from "zod";

export const approvalLevelSchema = z.enum(["WKF", "NATIONAL", "NON_APPROVED", "UNSPECIFIED"]);

export const availabilityStatusSchema = z.enum([
  "AVAILABLE",
  "CONSULT",
  "OUT_OF_STOCK",
  "COMING_SOON",
]);

export const priceBasisSchema = z.enum([
  "DIRECT_USD",
  "BCV_RATE_USD",
  "EURO_RATE_USD",
  "USDT",
  "CONSULT",
]);

export const priceCurrencySchema = z.enum(["USD", "USDT"]);

export const imageSourceTypeSchema = z.enum(["OWN", "MANUFACTURER", "PROVIDER", "OTHER"]);

export const brandSchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    logo: z.string().min(1).optional(),
    active: z.boolean(),
  })
  .strict();

export const categorySchema = z
  .object({
    id: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    description: z.string(),
    parentId: z.string().min(1).nullable(),
    active: z.boolean(),
  })
  .strict();

export const variantOptionSchema = z
  .object({
    name: z.string().min(1),
    value: z.string().min(1),
  })
  .strict();

export const productVariantSchema = z
  .object({
    id: z.string().min(1),
    label: z.string().min(1),
    options: z.array(variantOptionSchema),
    available: z.boolean(),
  })
  .strict();

const fixedPriceSchema = z
  .object({
    amount: z.number().positive(),
    currency: priceCurrencySchema,
    basis: z.enum(["DIRECT_USD", "BCV_RATE_USD", "EURO_RATE_USD", "USDT"]),
    label: z.string().min(1),
    note: z.string().min(1).optional(),
  })
  .strict();

const consultPriceSchema = z
  .object({
    amount: z.null(),
    currency: z.null(),
    basis: z.literal("CONSULT"),
    label: z.string().min(1),
    note: z.string().min(1).optional(),
  })
  .strict();

export const productPriceSchema = z.union([fixedPriceSchema, consultPriceSchema]);

export const productImageSchema = z
  .object({
    src: z.string().min(1),
    alt: z.string().min(1),
    sourceType: imageSourceTypeSchema,
    sourceUrl: z.string().url().optional(),
  })
  .strict();

export const productSchema = z
  .object({
    id: z.string().min(1),
    sku: z.string().min(1),
    slug: z.string().min(1),
    name: z.string().min(1),
    brandId: z.string().min(1),
    categoryId: z.string().min(1),
    shortDescription: z.string().min(1),
    description: z.string().min(1),
    features: z.array(z.string().min(1)),
    approval: approvalLevelSchema,
    approvalNote: z.string().min(1).optional(),
    variants: z.array(productVariantSchema),
    prices: z.array(productPriceSchema),
    images: z.array(productImageSchema),
    availability: availabilityStatusSchema,
    featured: z.boolean(),
    active: z.boolean(),
  })
  .strict();

export const catalogSchema = z
  .object({
    brands: z.array(brandSchema),
    categories: z.array(categorySchema),
    products: z.array(productSchema),
  })
  .strict();
