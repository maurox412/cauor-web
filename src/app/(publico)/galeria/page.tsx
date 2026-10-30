import type { Metadata } from "next";
import Link from "next/link";
import TarjetaImagen from "@/components/TarjetaImagen";
import { db } from "@/lib/db";
import { media } from "@/lib/format";

export const metadata: Metadata = { title: "Galería · CAUOR" };
export const dynamic = "force-dynamic";

export default async function Galeria({ searchParams }: { searchParams: { anio?: string } }) {
  const anio = Number(searchParams.anio) || undefined;
  const [anios, albumes] = await Promise.all([
    db.album.groupBy({ by: ["anio"], orderBy: { anio: "desc" } }),
    db.album.findMany({
      where: anio ? { anio } : {},
      orderBy: [{ anio: "desc" }, { creadoEn: "desc" }],
      include: { _count: { select: { fotos: true } }, fotos: { orderBy: { orden: "asc" }, take: 1 } },
    }),
  ]);
  const tab = (activo: boolean) =>
    `rounded border px-4 py-2 text-sm font-semibold ${activo ? "border-navy bg-navy text-white" : "border-slate-300 bg-white hover:border-gold"}`;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-2 font-serif text-3xl font-bold text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">Galería de eventos</h1>
      <p className="mb-5 text-slate-600">Momentos que fortalecen nuestra comunidad. Cada evento tiene su álbum de fotos.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/galeria" className={tab(!anio)}>Todos</Link>
        {anios.map((a) => <Link key={a.anio} href={`/galeria?anio=${a.anio}`} className={tab(anio === a.anio)}>{a.anio}</Link>)}
      </div>

      {albumes.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {albumes.map((a) => (
            <TarjetaImagen key={a.id} href={`/galeria/${a.id}`} imagen={media(a.fotos[0]?.imagenPath)} etiqueta={String(a.anio)} titulo={a.titulo} detalle={`${a._count.fotos} fotos`} />
          ))}
        </div>
      ) : <p className="text-slate-500">Aún no hay álbumes publicados.</p>}
    </div>
  );
}
