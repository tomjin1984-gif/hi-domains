import Link from "next/link";
import { SiteHeader } from "@/components/site-shell";

const intelligenceMetrics = [
  { label: "Score", value: "87" },
  { label: "Valuation", value: "$18,500" },
  { label: "Buyer Profile", value: "AI SaaS" },
  { label: "Risk Analysis", value: "Low" },
];

const reportSignals = [
  { label: "Brand Score", value: "91" },
  { label: "SEO Score", value: "82" },
  { label: "Trend Score", value: "88" },
  { label: "Keyword Value", value: "84" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden bg-slate-950">
          <div className="absolute inset-0 opacity-25">
            <div className="grid h-full grid-cols-6 gap-px bg-slate-800">
              {Array.from({ length: 42 }).map((_, index) => (
                <div key={index} className="bg-slate-950" />
              ))}
            </div>
          </div>
          <div className="absolute right-0 top-16 hidden w-[46rem] max-w-[48vw] lg:block">
            <div className="space-y-4 rounded-l-xl border border-slate-800 bg-slate-900/90 p-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <p className="text-sm font-semibold text-white">vyoma.ai</p>
                  <p className="mt-1 text-xs text-slate-400">AI Intelligence Report</p>
                </div>
                <span className="rounded-full bg-teal-400 px-3 py-1 text-xs font-semibold text-slate-950">
                  Score 87
                </span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {reportSignals.map((signal) => (
                  <div key={signal.label} className="rounded-lg bg-slate-950 p-3">
                    <p className="text-xs text-slate-500">{signal.label}</p>
                    <p className="mt-2 text-lg font-semibold text-teal-300">{signal.value}</p>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-white p-4 text-slate-950">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Investment Thesis
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Strong AI-native brand fit with a concise name, premium extension and clear
                  buyer demand across automation, agent and infrastructure categories.
                </p>
              </div>
            </div>
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
            <div className="max-w-3xl">
              <p className="mb-5 inline-flex rounded-full border border-teal-300/30 bg-teal-300/10 px-3 py-1 text-sm font-medium text-teal-200">
                hi.domains
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                AI Domain Intelligence Platform
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Analyze domain value, investment potential and market opportunities with AI.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/signup"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-400 px-6 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
                >
                  Start Analyzing
                </Link>
                <Link
                  href="/report/example-domain"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-700 px-6 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-900"
                >
                  View Demo Report
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <article className="rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                AI Domain Valuation
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                AI powered domain scoring and valuation.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Score brand strength, market fit, keyword quality and investment potential
                before you buy, hold or list a domain.
              </p>
            </article>

            <article className="rounded-xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                Intelligence Report
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {intelligenceMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-medium text-slate-500">{metric.label}</p>
                    <p className="mt-2 text-lg font-semibold text-slate-950">{metric.value}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="bg-slate-100 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
                  Example Reports
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
                  See a public AI domain report
                </h2>
              </div>
              <Link
                href="/report/example-domain"
                className="inline-flex min-h-11 w-fit items-center rounded-lg bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                /report/example-domain
              </Link>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {["Valuation", "Buyer Profile", "Risk Analysis"].map((item) => (
                <article key={item} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-semibold text-slate-950">{item}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    Review concise AI-generated domain intelligence designed for investors,
                    founders and brokers.
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
              Create your account
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Start building a domain portfolio with AI valuation, analysis history and
              shareable public reports.
            </p>
            <div className="mt-8">
              <Link
                href="/signup"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-teal-600 px-6 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
              >
                Create your account
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="font-semibold text-slate-950">hi.domains</p>
          <p>AI domain valuation, intelligence reports and portfolio workflows.</p>
        </div>
      </footer>
    </div>
  );
}
