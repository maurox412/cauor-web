import Link from "next/link";
import { bs, media } from "@/lib/format";

type P = { id: string; nombre: string; descripcion: string | null; precio: unknown; imagenPath: string | null; pideGeneroTalla?: boolean };

export default function ProductoCard({ p, comprar = false }: { p: P; comprar?: boolean }) {
  const img = media(p.imagenPath);
  return (
    <article className="group overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-2xl">
      <div className="aspect-[4/3] overflow-hidden bg-navy">
        {img ? (
          <img src={img} alt={p.nombre} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_50%_45%,rgba(230,198,92,.35),transparent_60%)] transition duration-500 group-hover:scale-110" />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold text-navy">{p.nombre}</h3>
        <p className="my-1 text-sm text-slate-500">{p.descripcion}</p>
        {p.pideGeneroTalla && <p className="text-xs font-semibold text-navy-2">Varón y mujer · elige tu talla al comprar</p>}
        <p className="mt-1 text-lg font-bold text-amber-700">{bs(p.precio)}</p>
        {comprar && (
          <Link href={`/panel/compras?producto=${p.id}`} className="mt-3 inline-block rounded bg-gold px-5 py-2.5 text-sm font-semibold text-navy hover:bg-gold-2">
            Comprar
          </Link>
        )}
      </div>
    </article>
  );
}
