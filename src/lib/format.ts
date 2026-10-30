const LP = "America/La_Paz";

export const bs = (n: unknown) => `Bs. ${Number(n).toFixed(2)}`;

// Fechas con hora (eventos, noticias)
export const fechaEvento = (d: Date) =>
  new Intl.DateTimeFormat("es-BO", { day: "numeric", month: "long", year: "numeric", timeZone: LP }).format(d);

// Campos @db.Date (fecha de título, provisión nacional): se leen en UTC para no correr un día
export const fechaDia = (d: Date) =>
  new Intl.DateTimeFormat("es-BO", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(d);

export const diaMes = (d: Date) => ({
  dia: new Intl.DateTimeFormat("es-BO", { day: "2-digit", timeZone: LP }).format(d),
  mes: new Intl.DateTimeFormat("es-BO", { month: "short", timeZone: LP }).format(d).replace(".", "").toUpperCase(),
});

// Las fotos públicas se guardan como "media/…" y se sirven por /api/media/…
export const media = (p?: string | null) => (p ? `/api/media/${p.replace(/^media\//, "")}` : null);
