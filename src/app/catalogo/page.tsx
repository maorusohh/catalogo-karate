import { catalogRepository } from "@/lib/catalog/static-repository";

export default function CatalogoPage() {
  const products = catalogRepository.getProducts();

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-neutral-950">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium tracking-[0.2em] text-neutral-500 uppercase">
          Catálogo técnico
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">Productos de demostración</h1>

        <p className="mt-4 text-neutral-600">
          Esta página existe únicamente para verificar que el repositorio y el modelo de datos están
          funcionando correctamente.
        </p>

        <div className="mt-10 grid gap-4">
          {products.map((product) => (
            <article key={product.id} className="rounded-2xl border border-neutral-200 p-5">
              <p className="text-xs font-medium tracking-wide text-neutral-500 uppercase">
                {product.sku}
              </p>

              <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>

              <p className="mt-2 text-sm text-neutral-600">{product.shortDescription}</p>

              <div className="mt-4 text-sm text-neutral-500">
                <p>Marca: {product.brandId}</p>
                <p>Categoría: {product.categoryId}</p>
                <p>Disponibilidad: {product.availability}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
