"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const campo = "w-full rounded border border-slate-300 px-3 py-3";

export default function FormularioIngreso() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [ver, setVer] = useState(false);
  const [cargando, setCargando] = useState(false);

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setCargando(true);
    const f = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: f.get("username"), clave: f.get("clave"), recordar: f.get("recordar") === "on" }),
      });
      const datos = await res.json().catch(() => ({}));
      if (!res.ok) { setError(datos.error ?? "No se pudo iniciar sesión."); return; }
      router.push(datos.destino);
      router.refresh();
    } catch {
      setError("No se pudo conectar. Inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate>
      <label className="mb-4 block text-sm font-semibold">Usuario
        <input name="username" autoComplete="username" required placeholder="Ingresa tu usuario" className={`${campo} mt-1 font-normal`} />
      </label>
      <label className="mb-4 block text-sm font-semibold">Contraseña
        <span className="relative mt-1 block">
          <input name="clave" type={ver ? "text" : "password"} autoComplete="current-password" required placeholder="Ingresa tu contraseña" className={`${campo} pr-24 font-normal`} />
          <button type="button" onClick={() => setVer(!ver)} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 text-xs font-semibold text-slate-500">
            {ver ? "Ocultar" : "Mostrar"}
          </button>
        </span>
      </label>
      <label className="mb-5 flex items-center gap-2 text-sm"><input name="recordar" type="checkbox" /> Recordarme</label>
      <button type="submit" disabled={cargando} className="w-full rounded bg-gold py-3 font-semibold text-navy hover:bg-gold-2 disabled:opacity-60">
        {cargando ? "Ingresando…" : "Ingresar"}
      </button>
      {error && <p role="alert" className="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}
      <p className="mt-4 text-center text-sm text-slate-500">¿Olvidaste tu contraseña? ¿No tienes cuenta? Contacta al colegio.</p>
    </form>
  );
}
