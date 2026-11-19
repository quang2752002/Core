import Link from "next/link";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            Core<span className="text-cyan-400">.</span>
          </Link>
          <nav className="flex items-center gap-1 text-sm text-slate-400">
            <Link href="/" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">Home</Link>
            <Link href="/products" className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-white">Products</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 transition hover:text-white">Sign in</Link>
            <Link href="/admin" className="rounded-lg bg-cyan-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-cyan-300">Admin</Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      <footer className="mx-auto max-w-6xl border-t border-white/10 px-6 py-6 text-sm text-slate-500">© 2026 Core</footer>
    </div>
  );
}
