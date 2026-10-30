export default function Seccion({ titulo, id, children }: { titulo: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="w-full px-5 py-12 lg:px-12">
      <h2 className="mb-6 font-serif text-3xl font-bold uppercase tracking-wider text-navy after:mt-3 after:block after:h-[3px] after:w-[72px] after:bg-gold sm:text-4xl">
        {titulo}
      </h2>
      {children}
    </section>
  );
}
