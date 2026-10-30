"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Cada diapositiva trae su propia imagen (las sube el administrador). tamano/pos solo recortan la imagen.
export type Slide = { titulo: string; texto: string; boton: string; href: string; imagen: string; tamano?: string; pos?: string };

const SOMBRA = "linear-gradient(90deg, rgba(3,18,57,.9), rgba(3,18,57,.6) 50%, rgba(3,18,57,.15))";

export default function Carrusel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);
  const n = slides.length;

  useEffect(() => {
    if (n < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6500);
    return () => clearInterval(t);
  }, [n, i]); // se reinicia al cambiar manualmente

  if (n === 0) return null;

  return (
    <div className="relative min-h-[460px] w-full overflow-hidden bg-navy text-white md:min-h-[580px]"
      role="region" aria-roledescription="carrusel" aria-label="Avisos del colegio">
      {slides.map((s, k) => {
        const Titulo = k === 0 ? "h1" : "h2";
        return (
          <div key={`${k}-${s.titulo}`} aria-hidden={k !== i}
            className={`absolute inset-0 flex flex-col items-start justify-center px-6 transition-opacity duration-700 sm:px-[8vw] ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`}
            style={{
              backgroundImage: `${SOMBRA}, url(${s.imagen})`,
              backgroundSize: `cover, ${s.tamano ?? "cover"}`,
              backgroundPosition: `center, ${s.pos ?? "center"}`,
            }}>
            <Titulo className="max-w-3xl font-serif text-4xl font-bold leading-tight sm:text-5xl">{s.titulo}</Titulo>
            <span className="my-5 block h-0.5 w-28 bg-gold" />
            <p className="mb-6 max-w-xl text-xl text-slate-200">{s.texto}</p>
            <Link href={s.href} className="rounded bg-gold px-7 py-3.5 font-semibold text-navy hover:bg-gold-2">{s.boton}</Link>
          </div>
        );
      })}
      {n > 1 && (
        <>
          <button type="button" aria-label="Anterior" onClick={() => setI((i - 1 + n) % n)}
            className="absolute left-6 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full border border-white/50 bg-navy/40 text-2xl hover:bg-navy/70 sm:block">‹</button>
          <button type="button" aria-label="Siguiente" onClick={() => setI((i + 1) % n)}
            className="absolute right-6 top-1/2 hidden h-11 w-11 -translate-y-1/2 rounded-full border border-white/50 bg-navy/40 text-2xl hover:bg-navy/70 sm:block">›</button>
          <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
            {slides.map((s, k) => (
              <button key={`${k}-${s.titulo}`} type="button" aria-label={`Aviso ${k + 1}`} aria-current={k === i} onClick={() => setI(k)}
                className={`h-3 w-3 rounded-full border border-gold-2 ${k === i ? "bg-gold-2" : ""}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
