import { StatCard } from "@/components/ui/stat-card";

const stats = [
  { label: "Active users", value: "1,284", detail: "+12.5% this month" },
  { label: "Products", value: "48", detail: "+4 new products" },
  { label: "Conversion", value: "8.42%", detail: "+2.1% from last week" },
];

export function DashboardOverview() {
  return (
    <section>
      <div className="mb-10 max-w-2xl">
        <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-cyan-400">Feature-based starter</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Build each business domain in isolation.</h1>
        <p className="mt-4 text-lg leading-8 text-slate-400">Routes stay thin. Business logic lives inside its feature module, ready to grow with your application.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</div>
      <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-6">
        <p className="font-medium text-cyan-200">Where to start</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">Add UI, hooks, services, schemas, and types inside <code className="mx-1 rounded bg-black/20 px-1.5 py-0.5 text-cyan-300">features/&lt;domain&gt;</code>. Keep reusable primitives in <code>components/</code>.</p>
      </div>
    </section>
  );
}
