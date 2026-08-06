import Link from "next/link";
import { DomainAnalyzer } from "@/components/domain-analyzer";
import type { Domain } from "@/lib/domains";
import type { UserProfile } from "@/lib/user";
import type { DomainAnalysis } from "@/types/domain";

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
  analysis: DomainAnalysis;
};

export type DomainCardProps = {
  domain: Domain;
};

export type DashboardHeaderProps = {
  profile: UserProfile | null;
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

export function DashboardHeader({ profile }: DashboardHeaderProps) {
  const profileLabel = getProfileLabel(profile);
  const profileInitials = getProfileInitials(profileLabel);

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
        <div className="hidden min-w-0 text-right sm:block">
          <p className="max-w-56 truncate text-sm font-semibold text-slate-950">
            {profileLabel}
          </p>
        </div>
        <button
          type="button"
          aria-label={`User profile: ${profileLabel}`}
          className="flex size-10 items-center justify-center rounded-lg bg-slate-950 text-sm font-semibold text-white"
        >
          {profileInitials}
        </button>
      </div>
    </header>
  );
}

function getProfileLabel(profile: UserProfile | null) {
  const fullName = profile?.full_name?.trim();

  if (fullName) {
    return fullName;
  }

  if (profile?.email) {
    return profile.email;
  }

  return "Signed in user";
}

function getProfileInitials(label: string) {
  const namePart = label.includes("@") ? label.split("@")[0] : label;
  const initials = namePart
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "HD";
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
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-950">Analyze a Domain</p>
          <p className="mt-1 text-sm text-slate-500">
            Prepare an AI analysis request from the dashboard shell.
          </p>
        </div>
        <DomainAnalyzer />
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

export function AnalysisCard({ analysis }: AnalysisCardProps) {
  const valueRange = formatCurrencyRange(
    analysis.valuation.currency,
    analysis.valuation.wholesaleMin,
    analysis.valuation.wholesaleMax,
  );

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-slate-950">{analysis.domain}</h3>
          <p className="mt-2 text-sm text-slate-500">Estimated Value:</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{valueRange}</p>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-center">
          <p className="text-xs font-medium text-teal-700">Score</p>
          <p className="text-xl font-semibold text-slate-950">{analysis.overallScore}</p>
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-teal-500" style={{ width: `${analysis.overallScore}%` }} />
      </div>
    </article>
  );
}

export function DomainCard({ domain }: DomainCardProps) {
  const extension = formatExtension(domain);
  const status = formatStatus(domain.status);
  const createdAt = formatDate(domain.created_at);

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate font-semibold text-slate-950">{domain.domain}</h3>
          <p className="mt-2 text-sm text-slate-500">Extension:</p>
          <p className="mt-1 text-sm font-semibold text-slate-700">{extension}</p>
        </div>
        <div className="rounded-lg border border-teal-100 bg-teal-50 px-3 py-2 text-center">
          <p className="text-xs font-medium text-teal-700">Status</p>
          <p className="text-sm font-semibold text-slate-950">{status}</p>
        </div>
      </div>
      <div className="mt-5 rounded-lg bg-slate-50 px-3 py-2">
        <p className="text-xs font-medium text-slate-500">Added</p>
        <p className="mt-1 text-sm font-semibold text-slate-700">{createdAt}</p>
      </div>
    </article>
  );
}

export function DomainEmptyState() {
  return (
    <article className="rounded-xl border border-dashed border-slate-300 bg-white p-5 shadow-sm">
      <h3 className="font-semibold text-slate-950">No domains yet</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Add domains to your portfolio table to see them here.
      </p>
    </article>
  );
}

function formatCurrencyRange(currency: string, min: number, max: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

  return `${formatter.format(min)} - ${formatter.format(max)}`;
}

function formatExtension(domain: Domain) {
  if (domain.extension) {
    return domain.extension.startsWith(".") ? domain.extension : `.${domain.extension}`;
  }

  const extension = domain.domain.split(".").pop();

  return extension && extension !== domain.domain ? `.${extension}` : "Unknown";
}

function formatStatus(status: string) {
  return status
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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
