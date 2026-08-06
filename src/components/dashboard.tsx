import Link from "next/link";

const sidebarItems = [
  "Dashboard",
  "Analyze Domain",
  "Portfolio",
  "Reports",
  "Opportunities",
  "Settings",
];

export type StatCardProps = {
  label: string;
  value: string;
  accent: "teal" | "amber" | "rose";
};

export type AnalysisCardProps = {
  domain: string;
  score: number;
  valueRange: string;
};

export function DashboardSidebar() {
  return (
    <aside className="border-b border-slate-800 bg-slate-950 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-4 lg:block lg:px-6 lg:py-6">
        <Link href="/" className="flex items-center gap-3" aria-label="hi.domains home">
          <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400 text-sm font-bold text-slate-950">
            hi
          </span>
          <div>
            <p className="text-base font-semibold tracking-tight">hi.domains</p>
            <p className="text-xs text-slate-400">Domain Intelligence</p>
          </div>
        </Link>
        <span className="rounded-full border border-slate-700 px-2 py-1 text-xs text-slate-400 lg:hidden">
          Pro
        </span>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:block lg:flex-1 lg:space-y-1 lg:px-4 lg:pb-0">
        {sidebarItems.map((item, index) => (
          <button
            key={item}
            type="button"
            className={`min-h-11 shrink-0 rounded-lg px-4 text-left text-sm font-medium transition lg:w-full ${
              index === 0
                ? "bg-white text-slate-950 shadow-sm"
                : "text-slate-300 hover:bg-slate-900 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </nav>

      <div className="hidden border-t border-slate-800 p-4 lg:block">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm font-semibold">Scale intelligence</p>
          <p className="mt-2 text-xs leading-5 text-slate-400">
            Unlock higher portfolio limits and deeper reports later.
          </p>
          <button
            type="button"
            className="mt-4 min-h-10 w-full rounded-lg bg-teal-400 px-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
          >
            Upgrade Plan
          </button>
        </div>
      </div>
    </aside>
  );
}

export function DashboardHeader() {
  return (
    <header className="flex flex-col gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between lg:px-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Command Center
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Static dashboard preview for domain investment workflows.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <IconButton label="Search">
          <span className="relative block size-4 rounded-full border-2 border-slate-600 after:absolute after:-bottom-1 after:-right-1 after:h-2 after:w-0.5 after:rotate-[-45deg] after:rounded-full after:bg-slate-600" />
        </IconButton>
        <IconButton label="Notifications">
          <span className="relative block h-4 w-3 rounded-t-full border-2 border-slate-600 after:absolute after:-bottom-1 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-slate-600" />
        </IconButton>
        <button
          type="button"
          aria-label="User profile"
          className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white"
        >
          HD
        </button>
      </div>
    </header>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="flex size-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
    >
      {children}
    </button>
  );
}

export function WelcomeCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
            Dashboard
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Domain Intelligence Center
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
            AI-powered insights for your domain portfolio.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3 text-center">
          {["Signals", "Risk", "Value"].map((item) => (
            <div key={item} className="min-w-20 rounded-lg bg-slate-950 px-3 py-3">
              <p className="text-xs text-slate-500">{item}</p>
              <p className="mt-1 text-sm font-semibold text-teal-300">Live</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnalyzeCard() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Analyze a Domain</p>
          <p className="mt-1 text-sm text-slate-500">
            Prepare an AI analysis request from the dashboard shell.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <label className="sr-only" htmlFor="quick-domain">
            Domain
          </label>
          <input
            id="quick-domain"
            name="quick-domain"
            type="text"
            defaultValue="example.ai"
            className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition focus:border-teal-300 focus:ring-4 focus:ring-teal-100 sm:w-64"
          />
          <button
            type="button"
            className="min-h-11 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Analyze Domain
          </button>
        </div>
      </div>
    </section>
  );
}

export function StatCard({ label, value, accent }: StatCardProps) {
  const accentClasses = {
    teal: "bg-teal-50 text-teal-700 ring-teal-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ring-1 ${accentClasses[accent]}`}>
          Live
        </span>
      </div>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </article>
  );
}

export function AnalysisCard({ domain, score, valueRange }: AnalysisCardProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{domain}</h3>
          <p className="mt-2 text-sm text-slate-500">Estimated Value:</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{valueRange}</p>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-center">
          <p className="text-xs font-medium text-teal-700">Score</p>
          <p className="text-xl font-semibold text-slate-950">{score}</p>
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-teal-500" style={{ width: `${score}%` }} />
      </div>
    </article>
  );
}

export function OpportunityCard({ keywords }: { keywords: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-950">AI Opportunities</h2>
          <p className="mt-1 text-sm text-slate-500">Trending Keywords:</p>
        </div>
        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-100">
          Market watch
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {keywords.map((keyword) => (
          <span
            key={keyword}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
          >
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}

export function RecentActivity({ items }: { items: string[] }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-950">Recent Activity</h2>
      <div className="mt-5 space-y-4">
        {items.map((item, index) => (
          <div key={item} className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-600">
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-800">{item}</p>
              <p className="text-xs text-slate-500">Static placeholder event</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
