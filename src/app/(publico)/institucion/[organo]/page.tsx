import type { TipoOrgano } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import Silueta from "@/components/Silueta";
import { db } from "@/lib/db";
import { media } from "@/lib/format";

export const dynamic = "force-dynamic";

const ORGANOS: Record<string, { tipo: TipoOrgano; nombre: string }> = {
  directorio: { tipo: "DIRECTORIO", nombre: "Directorio" },
  tribunal: { tipo: "TRIBUNAL_HONOR", nombre: "Tribunal de Honor y Ética Profesional" },
  consejo: { tipo: "CONSEJO_TECNICO", nombre: "Consejo Técnico de Auditoría y Contabilidad" },
};

export default async function Organo({ params }: { params: { organo: string } }) {
  if (!Object.prototype.hasOwnProperty.call(ORGANOS, params.organo)) notFound();
  const actual = ORGANOS[params.organo];
  const org = await db.organo.findUnique({
    where: { tipo: actual.tipo },
    include: { miembros: { orderBy: { orden: "asc" } } },
  });
  const foto = media(org?.fotoPath);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-5 font-serif text-3xl font-bold text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">Institución</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {Object.entries(ORGANOS).map(([slug, o]) => (
          <Link key={slug} href={`/institucion/${slug}`}
            className={`rounded border px-4 py-2 text-sm font-semibold ${slug === params.organo ? "border-navy bg-navy text-white" : "border-slate-300 bg-white text-slate-800 hover:border-gold"}`}>
            {o.nombre}
          </Link>
        ))}
      </div>

      {foto
        ? <img src={foto} alt={`Foto general: ${actual.nombre}`} className="mb-6 aspect-[21/8] w-full rounded-md border-2 border-gold object-cover" />
        : <div className="mb-6 grid aspect-[21/8] place-items-center rounded-md border-2 border-gold bg-gradient-to-br from-navy-2 to-navy text-gold-2">Foto de {actual.nombre}</div>}

      {org?.miembros.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {org.miembros.map((m) => {
            const f = media(m.fotoPath);
            return (
              <div key={m.id} className="rounded-md border border-slate-200 bg-white p-5 text-center">
                {f ? <img src={f} alt={m.nombre} className="mx-auto mb-3 h-28 w-[88px] rounded-md border border-gold object-cover" />
                   : <Silueta className="mx-auto mb-3 h-28 w-[88px]" />}
                <b className="block font-serif text-navy">{m.nombre}</b>
                <small className="text-slate-500">{m.cargo}</small>
              </div>
            );
          })}
        </div>
      ) : <p className="text-slate-500">Los miembros se publicarán próximamente.</p>}
    </div>
  );
}
