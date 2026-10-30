import type { Metadata } from "next";
import { db } from "@/lib/db";
import { diaMes, media } from "@/lib/format";

export const metadata: Metadata = { title: "Cursos y eventos · CAUOR" };
export const dynamic = "force-dynamic";

type Evento = Awaited<ReturnType<typeof db.eventoCurso.findMany>>[number];

function Tarjeta({ e }: { e: Evento }) {
  const { dia, mes } = diaMes(e.fecha);
  const afiche = media(e.afichePath);
  const esPdf = afiche?.toLowerCase().endsWith(".pdf");
  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm">
      <div className="relative grid aspect-[16/10] place-items-center bg-gradient-to-br from-navy-2 to-navy">
        {afiche && !esPdf ? <img src={afiche} alt={`Afiche: ${e.titulo}`} className="h-full w-full object-cover" /> : <span className="font-serif text-gold-2">{esPdf ? "Afiche en PDF" : "Afiche del evento"}</span>}
        <span className="absolute left-3 top-3 rounded-sm border-t-[3px] border-gold bg-white px-2.5 py-1 text-center text-[11px] font-semibold leading-tight tracking-widest text-navy">
          <b className="block font-serif text-xl tracking-normal">{dia}</b>{mes}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-semibold text-navy">{e.titulo}</h3>
        <p className="text-sm text-slate-500">{[e.lugar, e.horario].filter(Boolean).join(" · ")}</p>
        {esPdf && <a href={afiche!} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-semibold text-navy-2 underline">Ver afiche</a>}
      </div>
    </article>
  );
}

export default async function Cursos() {
  const ahora = new Date();
  const [proximos, pasados] = await Promise.all([
    db.eventoCurso.findMany({ where: { publicado: true, fecha: { gte: ahora } }, orderBy: { fecha: "asc" } }),
    db.eventoCurso.findMany({ where: { publicado: true, fecha: { lt: ahora } }, orderBy: { fecha: "desc" }, take: 6 }),
  ]);
  const titulo = "mb-4 font-serif text-xl font-bold uppercase tracking-wider text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-6 font-serif text-3xl font-bold text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">Cursos y eventos</h1>
      <h2 className={titulo}>Próximos</h2>
      {proximos.length ? <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{proximos.map((e) => <Tarjeta key={e.id} e={e} />)}</div> : <p className="mb-10 text-slate-500">No hay cursos ni eventos programados por el momento.</p>}
      {pasados.length > 0 && (<><h2 className={titulo}>Anteriores</h2><div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{pasados.map((e) => <Tarjeta key={e.id} e={e} />)}</div></>)}
    </div>
  );
}
