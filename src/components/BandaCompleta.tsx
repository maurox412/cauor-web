import Link from "next/link";

type Props = { titulo: string; texto: string; boton: string; href: string; imagen: string };

// Banda a todo el ancho de la pantalla con imagen difuminada en azul detrás del texto.
export default function BandaCompleta({ titulo, texto, boton, href, imagen }: Props) {
  return (
    <section className="relative my-10 w-full overflow-hidden bg-navy text-white">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imagen})` }} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/70 to-navy/45" aria-hidden="true" />
      <div className="relative flex flex-wrap items-center justify-between gap-8 border-y-[3px] border-gold px-5 py-16 lg:px-12 lg:py-20">
        <div>
          <h2 className="mb-2 font-serif text-3xl font-bold text-gold-2 sm:text-5xl">{titulo}</h2>
          <p className="max-w-2xl text-lg text-slate-200">{texto}</p>
        </div>
        <Link href={href} className="rounded bg-gold px-9 py-4 text-lg font-semibold text-navy hover:bg-gold-2">{boton}</Link>
      </div>
    </section>
  );
}
