import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashClave, leerSesion, verificarClave } from "@/lib/auth";

const Body = z.object({ actual: z.string().min(1).max(200), nueva: z.string().min(10).max(200) });

// El colegiado cambia su contraseña (el usuario nunca se cambia).
export async function POST(req: Request) {
  const origen = req.headers.get("origin");
  if (origen && origen !== new URL(req.url).origin) {
    return NextResponse.json({ error: "Solicitud no permitida" }, { status: 403 });
  }
  const sesion = await leerSesion();
  if (!sesion) return NextResponse.json({ error: "Sesión vencida" }, { status: 401 });

  const datos = Body.safeParse(await req.json().catch(() => null));
  if (!datos.success) return NextResponse.json({ error: "La nueva contraseña debe tener al menos 10 caracteres." }, { status: 400 });
  const { actual, nueva } = datos.data;
  if (actual === nueva) return NextResponse.json({ error: "La nueva contraseña debe ser distinta." }, { status: 400 });

  const u = await db.usuario.findUnique({ where: { id: sesion.uid } });
  const ok = u ? await verificarClave(u.passwordHash, actual).catch(() => false) : false;
  if (!u || !ok) return NextResponse.json({ error: "La contraseña actual no es correcta." }, { status: 400 });

  await db.usuario.update({ where: { id: u.id }, data: { passwordHash: await hashClave(nueva), debeCambiarClave: false } });
  return NextResponse.json({ ok: true });
}
