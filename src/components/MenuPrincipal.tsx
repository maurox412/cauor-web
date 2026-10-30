"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MENU } from "@/lib/nav";

const enlace =
  "block border-b-[3px] border-transparent px-3 py-3 text-[13px] font-semibold uppercase tracking-wider text-navy hover:border-navy";

export default function MenuPrincipal() {
  const ruta = usePathname();
  const [abierto, setAbierto] = useState(false);
  const [sub, setSub] = useState(false);
  const cerrar = () => { setAbierto(false); setSub(false); };

  return (
    <nav className="bg-gold" aria-label="Principal">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 lg:hidden">
        <span className="py-3 text-sm font-semibold uppercase tracking-wider text-navy">Menú</span>
        <button
          type="button"
          aria-expanded={abierto}
          onClick={() => setAbierto(!abierto)}
          className="rounded border border-navy px-3 py-1 text-sm font-semibold text-navy"
        >
          {abierto ? "Cerrar" : "Abrir"}
        </button>
      </div>

      <ul className={`${abierto ? "flex" : "hidden"} mx-auto max-w-6xl flex-col px-5 pb-3 lg:flex lg:flex-row lg:items-center lg:gap-0.5 lg:pb-0`}>
        {MENU.map((it) =>
          it.sub ? (
            <li key={it.texto} className="relative" onMouseEnter={() => setSub(true)} onMouseLeave={() => setSub(false)}>
              <button type="button" aria-expanded={sub} onClick={() => setSub(!sub)} className={`${enlace} w-full text-left`}>
                {it.texto} ▾
              </button>
              {sub && (
                <ul className="z-20 border-t-[3px] border-gold bg-white p-1.5 shadow-xl lg:absolute lg:left-0 lg:top-full lg:min-w-[330px]">
                  {it.sub.map((s) => (
                    <li key={s.href}>
                      <Link href={s.href} onClick={cerrar} className="block px-3 py-2.5 text-sm text-navy hover:bg-amber-50">
                        {s.texto}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ) : (
            <li key={it.href}>
              <Link href={it.href!} onClick={cerrar} className={`${enlace} ${ruta === it.href ? "border-navy" : ""}`}>
                {it.texto}
              </Link>
            </li>
          )
        )}
        <li className="mt-2 lg:ml-auto lg:mt-0">
          <Link href="/ingresar" onClick={cerrar} className="block rounded bg-navy px-4 py-2.5 text-center text-sm font-semibold text-gold-2 hover:bg-navy-2">
            Login colegiados
          </Link>
        </li>
      </ul>
    </nav>
  );
}
