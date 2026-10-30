import Link from "next/link";

type Props = { titulo: string; detalle: string; href?: string };

export default function FilaLista({ titulo, detalle, href }: Props) {
  const clases = "mb-3 grid grid-cols-[1fr_110px] overflow-hidden rounded-md border border-slate-200 bg-white";
  const contenido = (
    <>
      <div className="p-4">
        <h3 className="font-serif font-semibold text-navy">{titulo}</h3>
        <p className="text-sm text-slate-500">{detalle}</p>
      </div>
      <span className="border-l-4 border-gold bg-gradient-to-br from-navy-2 to-navy" />
    </>
  );
  return href ? <Link href={href} className={`${clases} hover:border-gold`}>{contenido}</Link> : <div className={clases}>{contenido}</div>;
}
