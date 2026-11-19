import Link from "next/link";
import { PublicShell } from "@/components/layout/public-shell";

export default function LoginPage() {
  return <PublicShell><div className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-8"><p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Auth feature</p><h1 className="mt-3 text-3xl font-semibold">Welcome back</h1><p className="mt-3 text-sm leading-6 text-slate-400">This is the route shell. Add the real form and auth service under <code className="mx-1 rounded bg-white/10 px-1.5 py-0.5 text-cyan-300">features/auth</code>.</p><Link href="/admin" className="mt-6 inline-block text-sm text-cyan-300 hover:text-cyan-200">Continue to admin →</Link></div></PublicShell>;
}
