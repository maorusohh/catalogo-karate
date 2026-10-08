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

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5 shrink-0" fill="currentColor">
      <path d="M12 2.25a9.75 9.75 0 0 0-8.42 14.67L2.5 21.5l4.74-1.04A9.75 9.75 0 1 0 12 2.25Zm0 17.77a7.98 7.98 0 0 1-4.08-1.12l-.29-.17-2.81.62.63-2.74-.19-.3A7.97 7.97 0 1 1 12 20.02Zm4.35-5.97c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.62-1.17-1.38-1.31-1.62-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.79-.19-.46-.39-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.15.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

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
                  className="action-whatsapp"
                >
                  <WhatsAppIcon />
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
