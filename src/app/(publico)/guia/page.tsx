import type { Metadata } from "next";
import Silueta from "@/components/Silueta";
import { db } from "@/lib/db";
import { fechaDia, media } from "@/lib/format";

export const metadata: Metadata = { title: "Guía de profesionales · CAUOR" };
export const dynamic = "force-dynamic";

type SP = Record<string, string | string[] | undefined>;
const v = (x: string | string[] | undefined) => (typeof x === "string" ? x.trim().slice(0, 80) : "");

const campo = "w-full rounded border border-slate-300 px-3 py-2.5";

export default async function Guia({ searchParams }: { searchParams: SP }) {
  const nombres = v(searchParams.nombres);
  const paterno = v(searchParams.paterno);
  const materno = v(searchParams.materno);
  const cauor = v(searchParams.cauor);
  const caub = v(searchParams.caub);
  const buscando = !!(nombres || paterno || materno || cauor || caub);
  const completo = !!(nombres && paterno && materno);

  // Solo se consultan y devuelven campos públicos: nunca estado ni deudas.
  const resultados = completo
    ? await db.colegiado.findMany({
        where: {
          visibleEnGuia: true,
          nombres: { contains: nombres, mode: "insensitive" },
          apellidoPaterno: { equals: paterno, mode: "insensitive" },
          apellidoMaterno: { equals: materno, mode: "insensitive" },
          ...(cauor ? { registroCauor: cauor } : {}),
          ...(caub ? { registroCaub: caub } : {}),
        },
        select: {
          id: true, nombres: true, apellidoPaterno: true, apellidoMaterno: true, registroCauor: true, registroCaub: true, fechaTitulo: true, fechaProvision: true, fotoPath: true,
          email: true, telefono: true, telefono2: true, direccion: true, mostrarEmail: true, mostrarTelefono: true, mostrarTelefono2: true, mostrarDireccion: true,
        },
        take: 20,
      })
    : [];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="mb-2 font-serif text-3xl font-bold text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">Guía pública de profesionales</h1>
      <p className="mb-6 text-slate-600">Ingresa los datos del profesional que buscas. Los registros son opcionales y ayudan a afinar la búsqueda.</p>

      <form method="get" className="grid gap-4 rounded-md border border-l-[6px] border-slate-200 border-l-gold bg-white p-6 md:grid-cols-3">
        {[["nombres", "Nombres", nombres, true], ["paterno", "Apellido paterno", paterno, true], ["materno", "Apellido materno", materno, true]].map(([n, l, val, req]) => (
          <label key={n as string} className="text-sm font-semibold">{l as string}
            <input name={n as string} defaultValue={val as string} required={req as boolean} maxLength={80} autoComplete="off" className={`${campo} mt-1 font-normal`} />
          </label>
        ))}
        <label className="text-sm font-semibold">Registro CAUOR <i className="font-normal not-italic text-slate-500">(opcional)</i>
          <input name="cauor" defaultValue={cauor} maxLength={20} inputMode="numeric" autoComplete="off" className={`${campo} mt-1 font-normal`} />
        </label>
        <label className="text-sm font-semibold">Registro CAUB <i className="font-normal not-italic text-slate-500">(opcional)</i>
          <input name="caub" defaultValue={caub} maxLength={20} inputMode="numeric" autoComplete="off" className={`${campo} mt-1 font-normal`} />
        </label>
        <div className="flex items-end">
          <button type="submit" className="w-full rounded bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-2">Buscar</button>
        </div>
      </form>

      <div className="mt-6 grid gap-4">
        {buscando && !completo && <p className="rounded border border-dashed border-slate-300 p-4 text-slate-600">Completa nombres, apellido paterno y apellido materno para buscar.</p>}
        {completo && resultados.length === 0 && <p className="rounded border border-dashed border-slate-300 p-4 text-slate-600">No encontramos un profesional con esos datos. Revisa la escritura o prueba sin los registros.</p>}
        {resultados.map((c) => {
          const f = media(c.fotoPath);
          return (
            <article key={c.id} className="grid grid-cols-[88px_1fr] gap-5 rounded-md border border-slate-200 bg-white p-4">
              {f ? <img src={f} alt="" className="h-28 w-[88px] rounded-md border border-gold object-cover" /> : <Silueta className="h-28 w-[88px]" />}
              <div>
                <h2 className="font-serif text-lg font-semibold text-navy">{c.nombres} {c.apellidoPaterno} {c.apellidoMaterno}</h2>
                <dl className="mt-1 grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-sm text-slate-500">
                  <dt>Registro CAUOR</dt><dd className="text-slate-800">{c.registroCauor}</dd>
                  <dt>Registro CAUB</dt><dd className="text-slate-800">{c.registroCaub ?? "—"}</dd>
                  <dt>Fecha de título</dt><dd className="text-slate-800">{fechaDia(c.fechaTitulo)}</dd>
                  <dt>Provisión nacional</dt><dd className="text-slate-800">{c.fechaProvision ? fechaDia(c.fechaProvision) : "—"}</dd>
                  {/* Contacto: solo lo que el propio colegiado decidió mostrar */}
                  {c.mostrarEmail && c.email && (<><dt>Correo</dt><dd className="text-slate-800">{c.email}</dd></>)}
                  {c.mostrarTelefono && c.telefono && (<><dt>Celular</dt><dd className="text-slate-800">{c.telefono}</dd></>)}
                  {c.mostrarTelefono2 && c.telefono2 && (<><dt>Teléfono</dt><dd className="text-slate-800">{c.telefono2}</dd></>)}
                  {c.mostrarDireccion && c.direccion && (<><dt>Dirección</dt><dd className="text-slate-800">{c.direccion}</dd></>)}
                </dl>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
