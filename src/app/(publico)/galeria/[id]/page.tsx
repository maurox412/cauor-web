import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { media } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AlbumPagina({ params }: { params: { id: string } }) {
  const album = await db.album.findUnique({ where: { id: params.id }, include: { fotos: { orderBy: { orden: "asc" } } } });
  if (!album) notFound();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/galeria" className="mb-4 inline-block font-semibold text-navy-2 underline">← Volver a los álbumes</Link>
      <h1 className="mb-1 font-serif text-3xl font-bold text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">{album.titulo}</h1>
      <p className="mb-6 text-slate-600">{album.anio} · {album.fotos.length} fotos</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {album.fotos.map((f, i) => (
          <a key={f.id} href={media(f.imagenPath)!} target="_blank" rel="noopener noreferrer"
            className="group aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-navy shadow-md hover:border-gold">
            <img src={media(f.imagenPath)!} alt={`${album.titulo}, foto ${i + 1}`} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
          </a>
        ))}
      </div>
    </div>
  );
}
