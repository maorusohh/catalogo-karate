import type { Metadata } from "next";

import { InfoCard, InfoPage, InfoSection } from "@/components/business/info-page";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Entregas",
  description:
    "Información sobre la coordinación de envíos y entregas de equipamiento de Karate-Do a nivel nacional.",
};

export default function EntregasPage() {
  return (
    <InfoPage
      eyebrow="Entregas"
      title="Coordinamos tu pedido para hacerlo llegar a donde estás."
      description="Trabajamos con proveedores que realizan envíos a nivel nacional, por lo que la modalidad de entrega se confirma según el producto y la ubicación."
    >
      <div className="space-y-16">
        <InfoSection
          title="¿Cómo funciona?"
          description="La entrega se coordina después de revisar disponibilidad y confirmar tu solicitud."
        >
          <div className="grid gap-4 md:grid-cols-3">
            <InfoCard
              number="01"
              title="Indica tu ubicación"
              description="Al realizar la consulta, indícanos la ciudad o zona donde necesitas recibir el pedido."
            />

            <InfoCard
              number="02"
              title="Revisamos la opción disponible"
              description="Te indicamos las alternativas de envío aplicables al producto y a tu ubicación."
            />

            <InfoCard
              number="03"
              title="Coordinamos la entrega"
              description="Una vez confirmadas las condiciones del pedido, se coordina el despacho correspondiente."
            />
          </div>
        </InfoSection>

        <InfoSection
          title="Envíos a nivel nacional"
          description="El catálogo está pensado para atender consultas de clientes de distintas zonas de Venezuela."
        >
          <div className="grid gap-6 md:grid-cols-2">
            <InfoCard
              title="Disponibilidad primero"
              description="Antes de coordinar un envío confirmamos que la referencia, talla, color o presentación solicitada esté disponible."
            />

            <InfoCard
              title="Condiciones según el pedido"
              description="Las condiciones de entrega pueden variar según el proveedor, el producto y la ubicación de destino."
            />
          </div>
        </InfoSection>

        <InfoSection
          title="Importante"
          description="La información de esta página es orientativa para el proceso de consulta."
        >
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
            <p className="max-w-3xl text-sm leading-6 text-amber-900">
              Las condiciones finales de envío, disponibilidad y coordinación se confirman antes de
              concretar la compra. Así evitamos darte información desactualizada sobre una
              referencia específica.
            </p>
          </div>
        </InfoSection>

        <div className="flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">
              ¿Quieres consultar una entrega?
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-600">
              Escríbenos con el producto que te interesa y tu ubicación para revisar las opciones
              disponibles.
            </p>
          </div>

          <ButtonLink href="/contacto" variant="secondary" size="lg" className="shrink-0">
            Ir a contacto
            <span aria-hidden="true">→</span>
          </ButtonLink>
        </div>
      </div>
    </InfoPage>
  );
}
