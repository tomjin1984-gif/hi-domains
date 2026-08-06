import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-shell";

const plans = [
  {
    name: "Starter",
    price: "$19",
    description: "For a small domain portfolio.",
    items: ["Domain list workspace", "Basic portfolio layout", "Manual review flow"],
  },
  {
    name: "Pro",
    price: "$49",
    description: "For investors preparing a larger workflow.",
    items: ["Priority portfolio views", "Saved decision notes", "Team-ready dashboard shell"],
    featured: true,
  },
  {
    name: "Studio",
    price: "$99",
    description: "For agencies managing client domains.",
    items: ["Multi-client structure", "Advanced reporting shell", "Export-ready layouts"],
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Pricing</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Simple SaaS pricing structure
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Placeholder plans for the first-stage website framework. Payments are not implemented.
          </p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`rounded-xl border bg-white p-6 shadow-sm ${
                plan.featured ? "border-teal-300 ring-4 ring-teal-100" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-semibold text-slate-950">{plan.name}</h2>
                {plan.featured ? (
                  <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                    Popular
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">{plan.description}</p>
              <div className="mt-6 flex items-end gap-1">
                <span className="text-4xl font-semibold tracking-tight text-slate-950">{plan.price}</span>
                <span className="pb-1 text-sm text-slate-500">/mo</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm text-slate-600">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 size-2 rounded-full bg-teal-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 text-sm font-semibold transition ${
                  plan.featured
                    ? "bg-teal-600 text-white hover:bg-teal-700"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Choose plan
              </Link>
            </article>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
