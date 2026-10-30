import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-12 bg-navy text-sm text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-7 px-5 py-9 md:grid-cols-3">
        <div>
          <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider text-white">Contactos</h3>
          <p>Teléfono: por completar</p><p>Correo: por completar</p><p>www.cauor.org.bo</p>
        </div>
        <div>
          <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider text-white">Info institucional</h3>
          <p>Colegio de Auditores de Oruro</p><p>Oruro, Bolivia</p>
        </div>
        <div>
          <h3 className="mb-2 font-sans text-sm font-semibold uppercase tracking-wider text-white">Legal</h3>
          <Link href="#" className="block hover:text-gold-2">Política de privacidad</Link>
          <Link href="#" className="block hover:text-gold-2">Términos de uso</Link>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-3 px-5 py-4 text-[13px]">
          <span>© {new Date().getFullYear()} Colegio de Auditores de Oruro. Todos los derechos reservados.</span>
          <em className="font-serif text-gold-2">Profesionales que generan confianza</em>
        </div>
      </div>
    </footer>
  );
}
