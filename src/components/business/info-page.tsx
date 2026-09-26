import type { ReactNode } from "react";

type InfoPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

type InfoCardProps = {
  number?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function InfoPage({ eyebrow, title, description, children }: InfoPageProps) {
  return (
    <main>
      <section className="border-b border-black/5">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#b31322] uppercase">
              {eyebrow}
            </p>

            <h1 className="mt-4 text-4xl leading-tight font-semibold tracking-tight text-neutral-950 sm:text-5xl">
              {title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg">
              {description}
            </p>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 sm:py-16 lg:px-8">{children}</div>
      </section>
    </main>
  );
}

export function InfoCard({ number, title, description, children }: InfoCardProps) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-6 sm:p-7">
      {number ? (
        <div className="flex size-10 items-center justify-center rounded-full bg-neutral-950 text-sm font-semibold text-white">
          {number}
        </div>
      ) : null}

      <h2 className="mt-5 text-lg font-semibold text-neutral-950">{title}</h2>

      <p className="mt-3 text-sm leading-6 text-neutral-600">{description}</p>

      {children ? <div className="mt-5 border-t border-black/5 pt-5">{children}</div> : null}
    </article>
  );
}

export function InfoSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
          {title}
        </h2>

        {description ? (
          <p className="mt-3 text-sm leading-6 text-neutral-600 sm:text-base">{description}</p>
        ) : null}
      </div>

      <div className="mt-8">{children}</div>
    </section>
  );
}
