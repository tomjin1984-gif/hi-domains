import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

const features = [
  {
    title: "Portfolio overview",
    description: "Keep domain names, renewal timing and ownership signals visible in one clean workspace.",
  },
  {
    title: "Valuation workflow",
    description: "Prepare the product surface for future domain value estimates without building analysis logic yet.",
  },
  {
    title: "Decision records",
    description: "Shape repeatable screens for tracking acquisition, holding and sale decisions as the product grows.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-24">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">
              hi.domains
            </p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
              AI Domain Intelligence Platform
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Analyze, value and manage your domains with AI.
            </p>
            <form className="mt-8 flex max-w-2xl flex-col gap-3 rounded-xl border border-slate-200 bg-white p-2 shadow-sm sm:flex-row">
              <label className="sr-only" htmlFor="domain">
                Domain name
              </label>
              <input
                id="domain"
                name="domain"
                type="text"
                placeholder="example.com"
                className="min-h-12 flex-1 rounded-lg border border-transparent px-4 text-base text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
              />
              <button
                type="button"
                className="min-h-12 rounded-lg bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Analyze
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500">
              <span>Domain valuation</span>
              <span className="text-slate-300">/</span>
              <span>Portfolio management</span>
              <span className="text-slate-300">/</span>
              <span>AI-ready workflow</span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="rounded-lg bg-slate-950 p-4 text-white">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Portfolio snapshot</span>
                <span className="rounded-full bg-teal-400/15 px-3 py-1 text-xs font-medium text-teal-200">
                  Draft UI
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {["Domains", "Est. value", "Renewals"].map((label, index) => (
                  <div key={label} className="rounded-lg bg-white/8 p-4">
                    <p className="text-xs text-slate-400">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">
                      {index === 0 ? "128" : index === 1 ? "$42k" : "9"}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-5 space-y-3 rounded-lg bg-white p-4 text-slate-950">
                {["acquire.ai", "ledger.domains", "marketpath.com"].map((domain, index) => (
                  <div key={domain} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                    <div>
                      <p className="font-medium">{domain}</p>
                      <p className="text-sm text-slate-500">Awaiting future analysis</p>
                    </div>
                    <span
                      className={`h-2.5 w-16 rounded-full ${
                        index === 0 ? "bg-teal-500" : index === 1 ? "bg-amber-400" : "bg-rose-400"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Product foundation
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                Built for the first SaaS stage
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                These screens establish the public site and app shell before any AI, database,
                payment or account logic is added.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {features.map((feature) => (
                <article key={feature.title} className="rounded-xl border border-slate-200 p-6">
                  <div className="mb-5 size-10 rounded-lg bg-teal-50 ring-1 ring-teal-100" />
                  <h3 className="text-lg font-semibold text-slate-950">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/signup"
                className="inline-flex rounded-lg bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                Create workspace
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
