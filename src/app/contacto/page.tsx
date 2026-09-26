import type { Metadata } from "next";

import { InfoCard, InfoPage, InfoSection } from "@/components/business/info-page";
import { siteConfig } from "@/config/site";
import { buildWhatsAppUrl } from "@/lib/whatsapp/url";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Ponte en contacto para consultar disponibilidad, precios y entregas de equipamiento de Karate-Do.",
};

const directMessage = "Hola, quiero realizar una consulta sobre equipamiento de Karate-Do.";

const whatsappUrl = buildWhatsAppUrl(directMessage);

export default function ContactoPage() {
  return (
    <InfoPage
      eyebrow="Contacto"
      title="¿Necesitas ayuda para elegir?"
      description="Puedes enviarnos tu selección desde el carrito o escribirnos directamente para consultar sobre productos, variantes, disponibilidad y entregas."
    >
      <div className="space-y-16">
        <InfoSection
          title="Atención por WhatsApp"
          description="La atención comercial se concentra en un solo canal para poder revisar tu solicitud y responderte con la información correspondiente."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <InfoCard
              title="Consulta desde el carrito"
              description="Agrega varios productos, define sus variantes y envía una sola consulta estructurada."
            >
              <p className="text-sm font-medium text-neutral-950">
                Recomendado para pedidos con varios productos.
              </p>
            </InfoCard>

            <InfoCard
              title="Consulta directa"
              description="También puedes iniciar una conversación sin preparar primero una selección."
            >
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#b31322] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#8d0f1b]"
                >
                  Escribir por WhatsApp
                </a>
              ) : (
                <p className="text-sm leading-6 text-amber-800">
                  El canal de WhatsApp todavía no está configurado.
                </p>
              )}
            </InfoCard>
          </div>
        </InfoSection>

        <InfoSection
          title="¿Qué puedes consultar?"
          description="Nuestro canal de atención está pensado para ayudarte a cerrar los detalles antes de comprar."
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              title="Disponibilidad"
              description="Consulta si una referencia y su variante están disponibles."
            />

            <InfoCard
              title="Precio"
              description="Solicita confirmación del precio correspondiente al producto."
            />

            <InfoCard
              title="Variantes"
              description="Consulta tallas, colores y otras presentaciones disponibles."
            />

            <InfoCard
              title="Entregas"
              description="Pregunta por las alternativas de envío para tu ubicación."
            />
          </div>
        </InfoSection>

        <div className="rounded-3xl bg-neutral-950 p-6 text-white sm:p-8">
          <p className="text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
            {siteConfig.name}
          </p>

          <h2 className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
            Una buena consulta empieza con la información correcta.
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-300">
            Selecciona los productos que necesitas y envíanos tu consulta. Nosotros revisamos
            contigo los detalles antes de concretar el pedido.
          </p>
        </div>
      </div>
    </InfoPage>
  );
}
