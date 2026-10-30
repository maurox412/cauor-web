import type { Metadata } from "next";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Nosotros · CAUOR" };
export const dynamic = "force-dynamic";

const VALORES = [
  ["Ética", "Nuestro pilar"],
  ["Profesionalismo", "Nuestra vocación"],
  ["Compromiso", "Con la sociedad"],
];

export default async function Nosotros() {
  const ajustes = await db.ajuste.findMany({ where: { clave: { in: ["mision", "vision"] } } });
  const texto = (k: string) => ajustes.find((a) => a.clave === k)?.valor ?? "";

  return (
    <>
      <div className="border-b-[3px] border-gold bg-gradient-to-br from-navy-2 to-navy py-12 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <h1 className="font-serif text-4xl font-bold">Nosotros</h1>
          <p className="mt-2 text-lg text-slate-300">Nuestra esencia, nuestro compromiso</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:grid-cols-[1fr_1.2fr]">
        <div className="grid place-items-center rounded-md border-2 border-gold bg-gradient-to-br from-navy-2 to-navy p-10">
          <img src="/logo.png" alt="Logo del Colegio de Auditores de Oruro" className="w-48" />
        </div>
        <div className="space-y-8">
          {[["Misión", texto("mision")], ["Visión", texto("vision")]].map(([t, c]) => (
            <div key={t}>
              <h2 className="font-serif text-2xl font-bold uppercase tracking-wider text-navy after:mt-2 after:block after:h-0.5 after:w-12 after:bg-gold">{t}</h2>
              <p className="mt-3 text-slate-600">{c}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-navy text-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 md:grid-cols-3">
          {VALORES.map(([t, s]) => (
            <div key={t}>
              <b className="block font-serif text-lg text-gold-2">{t}</b>
              <span className="text-sm text-slate-300">{s}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
