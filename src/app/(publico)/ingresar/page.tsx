import type { Metadata } from "next";
import FormularioIngreso from "@/components/FormularioIngreso";

export const metadata: Metadata = { title: "Ingresar · CAUOR" };

export default function Ingresar() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <div className="grid overflow-hidden rounded-lg border border-slate-200 shadow-xl md:grid-cols-2">
        <div className="flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-navy-2 to-navy p-10 text-center text-white">
          <img src="/logo.png" alt="Logo del Colegio de Auditores de Oruro" className="w-40" />
          <h2 className="font-serif text-lg font-bold uppercase tracking-wider">Colegio de Auditores<br />de Oruro (CAUOR)</h2>
          <span className="h-0.5 w-14 bg-gold" />
          <p className="font-serif italic text-slate-300">Juntos por una auditoría de excelencia</p>
        </div>
        <div className="bg-white p-9">
          <h1 className="font-serif text-2xl font-bold text-navy">Iniciar sesión</h1>
          <p className="mb-6 mt-1 text-slate-500">Accede a tu cuenta de colegiado o administrador.</p>
          <FormularioIngreso />
        </div>
      </div>
    </div>
  );
}
