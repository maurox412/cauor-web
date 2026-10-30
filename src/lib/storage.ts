import { createHash, randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const BASE = path.resolve(process.env.STORAGE_DIR ?? "./storage");

// El tipo se decide por el contenido real del archivo, no por su extensión ni por lo que declare el navegador.
const FIRMAS = [
  { ext: "pdf", mime: "application/pdf", ok: (b: Buffer) => b.subarray(0, 5).toString("latin1") === "%PDF-" },
  { ext: "jpg", mime: "image/jpeg", ok: (b: Buffer) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: "png", mime: "image/png", ok: (b: Buffer) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
];

export class ArchivoInvalido extends Error {}

export async function guardarComprobante(file: File) {
  if (file.size === 0 || file.size > MAX_BYTES) {
    throw new ArchivoInvalido("El archivo debe pesar como máximo 5 MB.");
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const tipo = FIRMAS.find((f) => f.ok(buf));
  if (!tipo) throw new ArchivoInvalido("Formato no permitido. Sube una imagen JPG o PNG, o un PDF.");

  const hash = createHash("sha256").update(buf).digest("hex");
  const rel = path.join("comprobantes", String(new Date().getFullYear()), `${randomUUID()}.${tipo.ext}`);
  const abs = path.join(BASE, rel);
  await mkdir(path.dirname(abs), { recursive: true });
  await writeFile(abs, buf, { flag: "wx", mode: 0o640 });
  return { path: rel, hash, mime: tipo.mime };
}

// Ruta absoluta segura (evita salir de la carpeta de almacenamiento).
export function rutaAbsoluta(rel: string) {
  const abs = path.resolve(BASE, rel);
  if (!abs.startsWith(BASE + path.sep)) throw new Error("Ruta no permitida");
  return abs;
}
