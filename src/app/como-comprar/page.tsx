import type { Metadata } from "next";

import { InfoCard, InfoPage, InfoSection } from "@/components/business/info-page";

export const metadata: Metadata = {
  title: "Cómo comprar",
  description:
    "Conoce el proceso para seleccionar equipamiento de Karate-Do, preparar tu consulta y coordinar la compra.",
};

const steps = [
  {
    number: "01",
    title: "Explora el catálogo",
    description: "Busca por producto, categoría o marca y revisa las características disponibles.",
  },
  {
    number: "02",
    title: "Define tu variante",
    description:
      "Cuando un producto tenga opciones como talla, color o presentación, selecciona la combinación que necesitas.",
  },
  {
    number: "03",
    title: "Agrégalo al carrito",
    description:
      "Puedes reunir varios productos y diferentes variantes en una sola selección antes de realizar la consulta.",
  },
  {
    number: "04",
    title: "Consulta por WhatsApp",
    description:
      "Envía tu selección en un solo mensaje para solicitar disponibilidad, precio y opciones de entrega.",
  },
  {
    number: "05",
    title: "Confirma antes de comprar",
    description:
      "La disponibilidad y las condiciones se revisan contigo antes de concretar la compra.",
  },
];

export default function ComoComprarPage() {
  return (
    <InfoPage
      eyebrow="Cómo comprar"
      title="Del catálogo a tu pedido, sin complicaciones."
      description="El catálogo te ayuda a encontrar y organizar lo que necesitas. La confirmación final se realiza contigo por WhatsApp."
    >
      <div className="space-y-16">
        <InfoSection
          title="Un proceso pensado para consultar antes de comprar"
          description="No necesitas crear una cuenta ni realizar un pago desde el sitio en esta primera versión."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {steps.map((step) => (
              <InfoCard
                key={step.number}
                number={step.number}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </InfoSection>

        <InfoSection
          title="¿Por qué confirmamos por WhatsApp?"
          description="Porque algunos productos dependen de disponibilidad, variante y condiciones de suministro."
        >
          <div className="rounded-3xl border border-black/10 bg-neutral-950 p-6 text-white sm:p-8">
            <p className="max-w-3xl text-base leading-7 text-neutral-200">
              Tu carrito funciona como una lista de consulta. Antes de concretar la compra revisamos
              contigo los productos seleccionados, la disponibilidad, el precio correspondiente y
              las opciones de entrega.
            </p>
          </div>
        </InfoSection>

        <InfoSection
          title="Antes de enviar tu consulta"
          description="Una selección clara ayuda a responderte más rápido."
        >
          <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
            <ul className="grid gap-4 text-sm leading-6 text-neutral-600 sm:grid-cols-2">
              <li>• Revisa que la variante seleccionada sea la correcta.</li>
              <li>• Verifica las cantidades que necesitas.</li>
              <li>• Añade todos los productos que quieras consultar.</li>
              <li>• Envía la selección completa desde el carrito.</li>
            </ul>
          </div>
        </InfoSection>
      </div>
    </InfoPage>
  );
}
