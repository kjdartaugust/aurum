import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-px flex min-h-[70vh] items-center justify-center py-20">
      <div className="max-w-md text-center">
        <p className="font-serif text-7xl text-gold-gradient bg-gold-gradient bg-clip-text text-transparent">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl text-zinc-50">
          This page has been melted down
        </h1>
        <p className="mt-3 text-zinc-400">
          The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
          Let&rsquo;s get you back to solid gold.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/" className="btn-gold">
            Back home
          </Link>
          <Link href="/products" className="btn-outline">
            Browse catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
