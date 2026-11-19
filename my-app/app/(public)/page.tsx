import Link from "next/link";

export default function HomePage() {
  return (
    <section className="py-12 md:py-24">
      <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">Public website</p>
      <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">A clean foundation for your next product.</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">The public website and admin panel have separate layouts, while business logic stays organized inside feature modules.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/products" className="rounded-lg bg-cyan-400 px-5 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">Explore products</Link>
        <Link href="/admin" className="rounded-lg border border-white/15 px-5 py-3 font-medium transition hover:border-cyan-400 hover:text-cyan-300">Open admin</Link>
      </div>
    </section>
  );
}
