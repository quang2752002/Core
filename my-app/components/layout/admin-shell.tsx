import Link from "next/link";

const navigation = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/users", label: "Users" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-slate-950 p-5 md:block">
          <Link href="/admin" className="text-lg font-semibold tracking-tight">
            Core<span className="text-cyan-400">.</span>
          </Link>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">Admin panel</p>
          <nav className="mt-8 space-y-1">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className="block rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-white/10 hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/" className="mt-8 block text-sm text-cyan-300 hover:text-cyan-200">← Back to website</Link>
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-white/10 px-6 py-4 md:px-10">
            <div className="flex items-center justify-between">
              <span className="font-medium md:hidden">Core Admin</span>
              <span className="hidden text-sm text-slate-400 md:block">Workspace overview</span>
              <Link href="/login" className="text-sm text-slate-400 hover:text-white">Sign out</Link>
            </div>
          </header>
          <main className="w-full max-w-6xl px-6 py-10 md:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
