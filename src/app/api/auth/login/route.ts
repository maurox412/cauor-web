import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { crearSesion, hashClave, verificarClave } from "@/lib/auth";

const Body = z.object({
  username: z.string().min(1).max(64),
  clave: z.string().min(1).max(200),
  recordar: z.boolean().optional(),
});

const MAX_INTENTOS = 5;
const BLOQUEO_MIN = 15;
let claveFalsa: string | null = null; // para no revelar por tiempo de respuesta si el usuario existe

const incorrecto = () => NextResponse.json({ error: "Usuario o contraseña incorrectos" }, { status: 401 });

export async function POST(req: Request) {
  const origen = req.headers.get("origin");
  if (origen && origen !== new URL(req.url).origin) {
    return NextResponse.json({ error: "Solicitud no permitida" }, { status: 403 });
  }

  const datos = Body.safeParse(await req.json().catch(() => null));
  if (!datos.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  const { username, clave, recordar } = datos.data;

  const u = await db.usuario.findUnique({ where: { username: username.trim().toUpperCase() }, include: { permisos: true } });

  if (u?.bloqueadoHasta && u.bloqueadoHasta > new Date()) {
    return NextResponse.json({ error: "Cuenta bloqueada temporalmente. Inténtalo más tarde." }, { status: 429 });
  }

  claveFalsa ??= await hashClave("clave-falsa-para-igualar-tiempos");
  const coincide = await verificarClave(u?.passwordHash ?? claveFalsa, clave).catch(() => false);

  if (!u || !u.activo || !coincide) {
    if (u) {
      const n = u.intentosFallidos + 1;
      await db.usuario.update({
        where: { id: u.id },
        data: n >= MAX_INTENTOS
          ? { intentosFallidos: 0, bloqueadoHasta: new Date(Date.now() + BLOQUEO_MIN * 60_000) }
          : { intentosFallidos: n },
      });
    }
    return incorrecto();
  }

  await db.usuario.update({
    where: { id: u.id },
    data: { intentosFallidos: 0, bloqueadoHasta: null, ultimoAcceso: new Date() },
  });
  await crearSesion({ uid: u.id, rol: u.rol, deleg: !!u.permisos }, !!recordar);

  return NextResponse.json({
    ok: true,
    destino: u.rol === "ADMIN" ? "/admin" : "/panel",
    debeCambiarClave: u.debeCambiarClave,
  });
}
