import type { CartItem } from "@/types/cart";

export function buildWhatsAppCartMessage(items: CartItem[]): string {
  const lines = [
    "Hola, quiero realizar una consulta sobre los siguientes productos del Catálogo Karate-Do:",
    "",
  ];

  items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.snapshot.productName}`);
    lines.push(`   Marca: ${item.snapshot.brandName}`);

    if (item.snapshot.variantLabel !== "Sin variante") {
      lines.push(`   Variante: ${item.snapshot.variantLabel}`);
    }

    if (item.snapshot.paymentLabel) {
      lines.push(`   Forma de pago preferida: ${item.snapshot.paymentLabel}`);
    }

    lines.push(`   Cantidad: ${item.quantity}`, `   SKU: ${item.snapshot.sku}`, "");
  });

  lines.push(
    "Quisiera confirmar disponibilidad, precio final y opciones de entrega.",
    "",
    "Gracias.",
  );

  return lines.join("\n");
}
