export type ItemMenu = { href?: string; texto: string; sub?: { href: string; texto: string }[] };

export const MENU: ItemMenu[] = [
  { href: "/", texto: "Inicio" },
  { href: "/nosotros", texto: "Nosotros" },
  {
    texto: "Institución",
    sub: [
      { href: "/institucion/directorio", texto: "Directorio" },
      { href: "/institucion/tribunal", texto: "Tribunal de Honor y Ética Profesional" },
      { href: "/institucion/consejo", texto: "Consejo Técnico de Auditoría y Contabilidad" },
    ],
  },
  { href: "/guia", texto: "Guía de profesionales" },
  { href: "/galeria", texto: "Galería" },
  { href: "/cursos", texto: "Cursos y eventos" },
  { href: "/tienda", texto: "Tienda virtual" },
  { href: "/ingresar", texto: "Pagos" },
];
