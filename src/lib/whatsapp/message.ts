import type { CartItem } from "@/types/cart";

export function buildWhatsAppCartMessage(items: CartItem[]): string {
  const lines = [
    "Hola, quiero realizar una consulta sobre los siguientes productos del Catálogo Karate-Do:",
    "",
  ];

  items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.snapshot.productName}`,
      `   Variante: ${item.snapshot.variantLabel}`,
      `   Cantidad: ${item.quantity}`,
      `   SKU: ${item.snapshot.sku}`,
      "",
    );
  });

  lines.push("Quisiera conocer disponibilidad, precio y opciones de entrega.", "", "Gracias.");

  return lines.join("\n");
}
