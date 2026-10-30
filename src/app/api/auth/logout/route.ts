import { NextResponse } from "next/server";
import { cerrarSesion } from "@/lib/auth";

export async function POST() {
  cerrarSesion();
  return new NextResponse(null, { status: 204 });
}
