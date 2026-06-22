import Link from "next/link";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group inline-flex items-center gap-2.5 ${className}`}
      aria-label="Aurum — home"
    >
      <span className="relative grid h-9 w-9 place-items-center rounded-full bg-gold-gradient shadow-gold">
        <span className="font-serif text-lg font-bold text-charcoal">A</span>
      </span>
      <span className="font-serif text-xl font-semibold tracking-wide text-zinc-100">
        Aurum
      </span>
    </Link>
  );
}
