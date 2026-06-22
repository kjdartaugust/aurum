export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <article className="container-px py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs uppercase tracking-[0.25em] text-gold">Aurum</p>
        <h1 className="mt-3 font-serif text-4xl text-zinc-50 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">Last updated: {updated}</p>
        <div className="hairline my-10" />
        <div
          className="space-y-6 text-sm leading-relaxed text-zinc-300
            [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-zinc-100
            [&_p]:text-zinc-400 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
            [&_li]:text-zinc-400 [&_a]:text-gold-light [&_a]:underline
            [&_strong]:text-zinc-200"
        >
          {children}
        </div>
        <div className="hairline my-12" />
        <p className="rounded-xl border border-gold/20 bg-gold/5 p-4 text-xs text-zinc-400">
          This is template legal copy for a demonstration storefront. Have it
          reviewed by qualified counsel and adapted to your jurisdiction before
          relying on it in production.
        </p>
      </div>
    </article>
  );
}
