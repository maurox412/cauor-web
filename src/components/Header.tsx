import Link from "next/link";
import MenuPrincipal from "./MenuPrincipal";

export default function Header() {
  return (
    <header>
      <div className="bg-navy">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-5 py-4">
          <Link href="/" className="flex items-center gap-4 text-white">
            <img src="/logo.png" alt="Logo del Colegio de Auditores de Oruro" className="h-16 w-auto lg:h-[76px]" />
            <span className="font-serif text-lg font-bold leading-tight lg:text-xl">
              Colegio de Auditores<br />de Oruro (CAUOR)
            </span>
          </Link>
        </div>
      </div>
      <MenuPrincipal />
    </header>
  );
}
