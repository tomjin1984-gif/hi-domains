import Link from "next/link";
import { BrandMark } from "@/components/site-shell";

const sidebarItems = ["Overview", "Domains", "Watchlist", "Settings"];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col md:flex-row">
        <aside className="border-b border-slate-200 bg-white md:w-72 md:border-b-0 md:border-r">
          <div className="flex items-center justify-between px-4 py-4 md:block md:px-6">
            <BrandMark />
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 md:mt-8 md:inline-flex"
            >
              Home
            </Link>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 md:block md:space-y-2 md:px-6 md:pb-0">
            {sidebarItems.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`min-h-10 shrink-0 rounded-lg px-4 text-left text-sm font-medium transition md:w-full ${
                  index === 0
                    ? "bg-slate-950 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-teal-700">Dashboard</p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Welcome</h1>
              </div>
              <button
                type="button"
                className="min-h-11 rounded-lg bg-teal-600 px-4 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Add domain
              </button>
            </div>

            <section className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-12">
              <div className="mx-auto flex size-14 items-center justify-center rounded-xl bg-teal-50 ring-1 ring-teal-100">
                <span className="text-xl font-semibold text-teal-700">hi</span>
              </div>
              <h2 className="mt-6 text-xl font-semibold text-slate-950">No domains yet</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
                Your portfolio workspace is ready. Add domains later when storage and product logic are implemented.
              </p>
              <button
                type="button"
                className="mt-6 min-h-11 rounded-lg border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Empty state action
              </button>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
