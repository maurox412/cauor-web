import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import argon2 from "argon2";

export const COOKIE_SESION = "cauor_session";
export type Rol = "COLEGIADO" | "ADMIN";
export type Sesion = { uid: string; rol: Rol; deleg?: boolean }; // deleg: administrador delegado

function clave(): Uint8Array {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET debe tener al menos 32 caracteres.");
  return new TextEncoder().encode(s);
}

// Contraseñas: argon2id (nunca texto plano ni cifrado reversible).
export const hashClave = (c: string) => argon2.hash(c, { type: argon2.argon2id });
export const verificarClave = (hash: string, c: string) => argon2.verify(hash, c);

export async function crearSesion(s: Sesion, recordar: boolean) {
  const duracion = recordar ? 60 * 60 * 24 * 14 : 60 * 60 * 8; // 14 días o 8 horas
  const token = await new SignJWT({ ...s })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + duracion)
    .sign(clave());

  cookies().set(COOKIE_SESION, token, {
    httpOnly: true,                                   // JavaScript del navegador no puede leerla
    secure: process.env.NODE_ENV === "production",    // solo por HTTPS en producción
    sameSite: "lax",                                  // protege contra CSRF
    path: "/",
    maxAge: recordar ? duracion : undefined,          // sin maxAge = cookie de sesión
  });
}

export async function leerSesion(): Promise<Sesion | null> {
  const token = cookies().get(COOKIE_SESION)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, clave());
    return { uid: String(payload.uid), rol: payload.rol as Rol, deleg: payload.deleg === true };
  } catch {
    return null;
  }
}

export function cerrarSesion() {
  cookies().delete(COOKIE_SESION);
}
