import Link from "next/link";
import Carrusel, { type Slide } from "@/components/Carrusel";
import TarjetaImagen from "@/components/TarjetaImagen";
import ProductoCard from "@/components/ProductoCard";
import BandaCompleta from "@/components/BandaCompleta";
import Seccion from "@/components/Seccion";
import { db } from "@/lib/db";
import { diaMes, fechaEvento, media } from "@/lib/format";

export const dynamic = "force-dynamic"; // los datos vienen de la base y cambian

// Diapositivas por defecto: se usan hasta que el administrador cargue las suyas (tabla Banner).
const SLIDES: Slide[] = [
  { titulo: "Bienvenidos al portal oficial del Colegio de Auditores de Oruro (CAUOR)", texto: "Promoviendo la excelencia y la ética profesional.", boton: "Login colegiados", href: "/ingresar", imagen: "/oruro.jpg", pos: "60% 40%" },
  { titulo: "Pague su mensualidad con código QR", texto: "Ingrese a su cuenta, escanee el código y suba su comprobante.", boton: "Ir a Pagos", href: "/ingresar", imagen: "/oruro.jpg", tamano: "230%", pos: "55% 42%" },
  { titulo: "Tienda virtual institucional", texto: "Productos del colegio con descripción y precio.", boton: "Ver catálogo", href: "/tienda", imagen: "/oruro.jpg", tamano: "190%", pos: "8% 85%" },
];

const Vacio = ({ texto }: { texto: string }) => <p className="text-slate-500">{texto}</p>;

export default async function Inicio() {
  const [noticias, cursos, productos, directorio, banners] = await Promise.all([
    db.noticia.findMany({ where: { publicado: true }, orderBy: { fecha: "desc" }, take: 3 }),
    db.eventoCurso.findMany({ where: { publicado: true, fecha: { gte: new Date() } }, orderBy: { fecha: "asc" }, take: 3 }),
    db.producto.findMany({ where: { activo: true }, orderBy: { nombre: "asc" }, take: 4 }),
    db.organo.findUnique({ where: { tipo: "DIRECTORIO" } }),
    db.banner.findMany({ where: { activo: true }, orderBy: { orden: "asc" } }),
  ]);
  const slides: Slide[] = banners.length
    ? banners.map((b) => ({ titulo: b.titulo, texto: b.texto ?? "", boton: b.boton ?? "Ver más", href: b.enlace ?? "/", imagen: media(b.imagenPath) ?? "/oruro.jpg" }))
    : SLIDES;
  const fotoDirectorio = media(directorio?.fotoPath);

  return (
    <>
      <Carrusel slides={slides} />

      <Seccion titulo="Últimas noticias">
        {noticias.length ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {noticias.map((n) => <TarjetaImagen key={n.id} href="/" imagen={media(n.imagenPath)} etiqueta="Noticia" titulo={n.titulo} detalle={fechaEvento(n.fecha)} />)}
          </div>
        ) : <Vacio texto="Aún no hay noticias publicadas." />}
      </Seccion>

      <Seccion titulo="Cursos destacados">
        {cursos.length ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {cursos.map((c) => {
              const { dia, mes } = diaMes(c.fecha);
              const esImagen = c.afichePath && !c.afichePath.toLowerCase().endsWith(".pdf");
              return <TarjetaImagen key={c.id} href="/cursos" imagen={esImagen ? media(c.afichePath) : null} etiqueta={`${dia} ${mes}`} titulo={c.titulo} detalle={[c.lugar, c.horario].filter(Boolean).join(" · ")} />;
            })}
          </div>
        ) : <Vacio texto="No hay cursos programados por el momento." />}
      </Seccion>

      <BandaCompleta titulo="Acceso para colegiados" texto="Consulta tu estado de cuenta, actualiza tus datos y paga tus mensualidades con código QR." boton="Ingresar a mi cuenta" href="/ingresar" imagen="/acceso.jpg" />

      <BandaCompleta titulo="Guía pública de profesionales" texto="Verifica que un auditor esté inscrito en el CAUOR buscándolo por nombre y apellidos." boton="Buscar un profesional" href="/guia" imagen="/guia.jpg" />

      <Seccion titulo="Tienda virtual">
        {productos.length ? (
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">{productos.map((p) => <ProductoCard key={p.id} p={p} />)}</div>
        ) : <Vacio texto="El catálogo estará disponible pronto." />}
        <Link href="/tienda" className="mt-4 inline-block font-semibold text-navy-2 underline">Ver toda la tienda</Link>
      </Seccion>

      <Seccion titulo="Institución">
        {fotoDirectorio
          ? <img src={fotoDirectorio} alt="Foto general del Directorio" className="aspect-[21/8] max-h-[560px] w-full rounded-md border-2 border-gold object-cover" />
          : <div className="grid aspect-[21/8] max-h-[560px] place-items-center rounded-md border-2 border-gold bg-gradient-to-br from-navy-2 to-navy text-gold-2">Foto general del Directorio</div>}
        <Link href="/institucion/directorio" className="mt-4 inline-block rounded bg-gold px-6 py-3 font-semibold text-navy hover:bg-gold-2">Conocer a la directiva</Link>
      </Seccion>
    </>
  );
}
