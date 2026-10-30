// Marcador de foto: silueta dorada sobre azul marino.
export default function Silueta({ className = "" }: { className?: string }) {
  return (
    <div className={`grid place-items-center rounded-md border border-gold bg-navy ${className}`}>
      <svg viewBox="0 0 24 24" width="40%" fill="none" stroke="#E6C65C" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
      </svg>
    </div>
  );
}
