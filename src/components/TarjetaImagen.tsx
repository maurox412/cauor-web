import Link from "next/link";

type Props = { href: string; imagen: string | null; etiqueta?: string; titulo: string; detalle?: string };

// Tarjeta grande con imagen: se eleva y la imagen se acerca al pasar el cursor.
export default function TarjetaImagen({ href, imagen, etiqueta, titulo, detalle }: Props) {
  return (
    <Link href={href} className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-1.5 hover:border-gold hover:shadow-2xl focus-visible:-translate-y-1.5 focus-visible:border-gold">
      <div className="relative aspect-[4/3] overflow-hidden bg-navy">
        {imagen ? (
          <img src={imagen} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_25%,rgba(230,198,92,.38),transparent_55%)] transition duration-500 group-hover:scale-110" />
        )}
        {etiqueta && (
          <span className="absolute left-3 top-3 rounded-sm border-t-[3px] border-gold bg-white px-2.5 py-1 text-xs font-semibold tracking-wider text-navy">{etiqueta}</span>
        )}
        <span className="absolute bottom-3 right-3 translate-y-2 rounded bg-gold px-3.5 py-1.5 text-sm font-semibold text-navy opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
          Ver más
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-serif text-xl font-semibold leading-snug text-navy">{titulo}</h3>
        {detalle && <p className="mt-1 text-sm text-slate-500">{detalle}</p>}
      </div>
    </Link>
  );
}
