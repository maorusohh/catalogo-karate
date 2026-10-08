import type { Metadata } from "next";

import { InfoPage, InfoSection } from "@/components/business/info-page";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas sobre el catálogo de Karate-Do, variantes, precios, formas de pago, disponibilidad y envíos.",
};

const questions = [
  {
    question: "¿Puedo comprar directamente desde la página?",
    answer:
      "La web funciona como catálogo y carrito de consulta. Puedes reunir los productos que te interesan y enviar la selección por WhatsApp; antes de concretar la compra se confirman disponibilidad, precio y condiciones de entrega.",
  },
  {
    question: "¿Cómo elijo talla, color u otra variante?",
    answer:
      "Cuando un producto tenga opciones verificadas, la ficha mostrará los selectores correspondientes. Elige la talla, color, longitud o presentación disponible antes de agregar el producto al carrito.",
  },
  {
    question: "¿Qué hago si no aparece la variante que necesito?",
    answer:
      "Si una opción no aparece en la ficha, no la damos por disponible automáticamente. Puedes consultarla por WhatsApp para confirmar si existe una alternativa o disponibilidad adicional.",
  },
  {
    question: "¿Los precios y formas de pago son iguales para todos los productos?",
    answer:
      "No necesariamente. Cada producto muestra las formas de pago y referencias de precio que correspondan a su información comercial. La confirmación final se realiza antes de concretar la compra.",
  },
  {
    question: "¿Qué significan las etiquetas de aprobación?",
    answer:
      "El catálogo muestra la aprobación disponible para cada referencia según la información verificada. Algunos productos cuentan con aprobación WKF, otros con aprobación nacional y otros pueden no estar aprobados para competición.",
  },
  {
    question: "¿Puedo consultar varios productos al mismo tiempo?",
    answer:
      "Sí. El carrito permite reunir varios productos, variantes y cantidades para enviarlos juntos en una sola consulta por WhatsApp.",
  },
  {
    question: "¿Realizan envíos?",
    answer:
      "Sí. Se coordinan envíos a nivel nacional según el producto, la disponibilidad y la ubicación. Los detalles se confirman contigo antes de concretar la compra.",
  },
  {
    question: "¿La disponibilidad que aparece en la web es definitiva?",
    answer:
      "La disponibilidad visible sirve como referencia comercial. Antes de concretar el pedido se confirma contigo el estado del producto y de la variante seleccionada.",
  },
];

export default function PreguntasFrecuentesPage() {
  return (
    <InfoPage
      eyebrow="Preguntas frecuentes"
      title="Respuestas claras antes de preparar tu consulta."
      description="Aquí reunimos las dudas más comunes sobre el catálogo, las variantes, los precios, las aprobaciones y los envíos."
    >
      <div className="space-y-16">
        <InfoSection
          title="Quiénes somos"
          description="Una propuesta especializada en equipamiento de Karate-Do para Venezuela."
        >
          <div className="rounded-3xl border border-black/10 bg-white p-6 sm:p-8">
            <p className="max-w-3xl text-base leading-7 text-neutral-600">
              Somos un catálogo especializado en implementos de Karate-Do para entrenamiento, kata y
              kumite. Reunimos distintas marcas y referencias para facilitar la búsqueda del
              equipamiento y acompañamos la confirmación final por WhatsApp antes de concretar cada
              compra.
            </p>
          </div>
        </InfoSection>

        <InfoSection
          title="Preguntas frecuentes"
          description="Abre cada pregunta para revisar la respuesta correspondiente."
        >
          <div className="grid gap-3">
            {questions.map((item) => (
              <details
                key={item.question}
                className="group rounded-3xl border border-black/10 bg-white px-5 py-1 sm:px-6"
              >
                <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-5 py-4 text-left text-base font-semibold text-neutral-950 [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-lg font-medium text-neutral-600 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>

                <div className="border-t border-black/6 pt-4 pb-5">
                  <p className="max-w-3xl text-sm leading-7 text-neutral-600 sm:text-base">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </InfoSection>

        <div className="grid gap-4 rounded-3xl bg-neutral-950 p-6 text-white sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-semibold tracking-tight">¿Necesitas más información?</h2>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              Revisa el proceso de compra y las condiciones de envío, o escríbenos directamente si
              tu duda depende de un producto específico.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
            <ButtonLink href="/como-comprar" variant="secondary" size="lg">
              Cómo comprar
            </ButtonLink>
            <ButtonLink href="/contacto" size="lg">
              Ir a contacto
            </ButtonLink>
          </div>
        </div>
      </div>
    </InfoPage>
  );
}
