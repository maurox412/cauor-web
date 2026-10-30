import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

// /panel: colegiados. /admin: administrador principal y administradores delegados.
// Ojo: esto solo filtra la entrada; cada acción del servidor vuelve a comprobar el permiso exacto
// (galería, cursos, tienda, pagos) de los delegados.
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("cauor_session")?.value;
  let rol: string | null = null;
  let deleg = false;

  if (token && process.env.SESSION_SECRET) {
    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SESSION_SECRET));
      rol = String(payload.rol);
      deleg = payload.deleg === true;
    } catch {
      rol = null;
    }
  }

  const esAdmin = req.nextUrl.pathname.startsWith("/admin");
  const permitido = esAdmin ? rol === "ADMIN" || deleg : rol === "COLEGIADO";
  if (!permitido) {
    const url = req.nextUrl.clone();
    url.pathname = "/ingresar";
    url.search = "";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/panel/:path*", "/admin/:path*"] };
