"use client";

import { useCallback, useState } from "react";

import { AddToCartButton } from "@/components/product/add-to-cart-button";
import { VariantSelector } from "@/components/product/variant-selector";
import type { ProductVariant } from "@/types/catalog";

type ProductPurchasePanelProps = {
  productId: string;
  productName: string;
  sku: string;
  brandName: string;
  variants: ProductVariant[];
};

export function ProductPurchasePanel({
  productId,
  productName,
  sku,
  brandName,
  variants,
}: ProductPurchasePanelProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>();

  const handleVariantChange = useCallback((variant: ProductVariant | undefined) => {
    setSelectedVariant(variant);
  }, []);

  return (
    <div>
      <VariantSelector variants={variants} onVariantChange={handleVariantChange} />

      <AddToCartButton
        productId={productId}
        productName={productName}
        sku={sku}
        brandName={brandName}
        variant={selectedVariant}
      />
    </div>
  );
}
