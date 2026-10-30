import { readFile } from "fs/promises";
import { rutaAbsoluta } from "@/lib/storage";

const TIPOS: Record<string, string> = {
  jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", webp: "image/webp", pdf: "application/pdf",
};

// Sirve solo la carpeta pública "media/" (fotos, afiches). Los comprobantes NO pasan por aquí.
export async function GET(_: Request, { params }: { params: { ruta: string[] } }) {
  const ext = params.ruta[params.ruta.length - 1].split(".").pop()?.toLowerCase() ?? "";
  const tipo = TIPOS[ext];
  if (!tipo) return new Response("No encontrado", { status: 404 });
  try {
    const buf = await readFile(rutaAbsoluta(["media", ...params.ruta].join("/")));
    return new Response(new Uint8Array(buf), {
      headers: { "Content-Type": tipo, "Cache-Control": "public, max-age=86400", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return new Response("No encontrado", { status: 404 });
  }
}
