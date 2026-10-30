import type { Metadata } from "next";
import ProductoCard from "@/components/ProductoCard";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Tienda virtual · CAUOR" };
export const dynamic = "force-dynamic";

export default async function Tienda() {
  const productos = await db.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" } });
  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-2 font-serif text-3xl font-bold text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">Tienda virtual</h1>
      <p className="mb-6 text-slate-600">Productos institucionales. Para comprar, el colegiado inicia sesión: se genera la orden de pago con su código QR y sube su comprobante.</p>
      {productos.length ? (
        <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">{productos.map((p) => <ProductoCard key={p.id} p={p} comprar />)}</div>
      ) : <p className="text-slate-500">El catálogo estará disponible pronto.</p>}
    </div>
  );
}
