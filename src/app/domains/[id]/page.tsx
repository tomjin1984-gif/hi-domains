import Link from "next/link";
import { notFound } from "next/navigation";
import {
  DashboardHeader,
  DashboardSidebar,
} from "@/components/dashboard";
import {
  getDomainAnalysisHistory,
  getLatestDomainAnalysis,
} from "@/lib/domain-analysis";
import type { LatestDomainAnalysis } from "@/lib/domain-analysis";
import { getUserDomainById } from "@/lib/domains";
import type { Domain } from "@/lib/domains";
import { getCurrentUserProfile } from "@/lib/user";

export default async function DomainDetailPage({
  params,
}: PageProps<"/domains/[id]">) {
  const { id } = await params;
  const [profile, domain] = await Promise.all([
    getCurrentUserProfile(),
    getUserDomainById(id),
  ]);

  if (!domain) {
    notFound();
  }

  const [analysis, analysisHistory] = await Promise.all([
    getLatestDomainAnalysis(domain.id),
    getDomainAnalysisHistory(domain.id),
  ]);
  const extension = formatExtension(domain);
  const fullDomain = formatFullDomain(domain, extension);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="lg:flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardHeader profile={profile} />
          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <div>
                <Link
                  href="/dashboard"
                  className="text-sm font-semibold text-teal-700 transition hover:text-teal-800"
                >
                  Back to Dashboard
                </Link>
              </div>

              <section className="rounded-xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm lg:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
                      Domain Detail
                    </p>
                    <h1 className="mt-3 truncate text-3xl font-semibold tracking-tight sm:text-4xl">
                      {fullDomain}
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                      Latest AI intelligence and portfolio status for this domain.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3 text-center">
                    <HeaderMetric label="Extension" value={extension} />
                    <HeaderMetric label="Status" value={formatStatus(domain.status)} />
                  </div>
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-950">Domain Profile</h2>
                  <div className="mt-5 space-y-3">
                    <DetailRow label="Domain" value={domain.domain} />
                    <DetailRow label="Extension" value={extension} />
                    <DetailRow label="Status" value={formatStatus(domain.status)} />
                  </div>
                </article>

                <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-950">
                    AI Intelligence Report
                  </h2>
                  <DomainAnalysisReport analysis={analysis} />
                </article>
              </section>

              <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Analysis History
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Recent AI analysis snapshots for this domain.
                    </p>
                  </div>
                  <span className="w-fit rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 ring-1 ring-teal-100">
                    {analysisHistory.length} records
                  </span>
                </div>
                <AnalysisHistory records={analysisHistory} />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function AnalysisHistory({ records }: { records: LatestDomainAnalysis[] }) {
  if (records.length === 0) {
    return <p className="mt-5 text-sm font-medium text-slate-500">No analysis yet</p>;
  }

  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-slate-200">
      <div className="hidden grid-cols-5 gap-4 bg-slate-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 md:grid">
        <p>Created</p>
        <p>Score</p>
        <p>Valuation</p>
        <p>Brand Score</p>
        <p>Trend Score</p>
      </div>
      <div className="divide-y divide-slate-200">
        {records.map((record) => (
          <div
            key={record.id}
            className="grid gap-3 px-4 py-4 text-sm md:grid-cols-5 md:items-center md:gap-4"
          >
            <HistoryMetric label="Created" value={formatDateTime(record.created_at)} />
            <HistoryMetric label="Score" value={formatScore(record.score)} />
            <HistoryMetric label="Valuation" value={formatValuation(record.valuation)} />
            <HistoryMetric label="Brand Score" value={formatScore(record.brand_score)} />
            <HistoryMetric label="Trend Score" value={formatScore(record.trend_score)} />
          </div>
        ))}
      </div>
    </div>
  );
}

function HistoryMetric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-slate-500 md:hidden">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-800 md:mt-0">{value}</p>
    </div>
  );
}

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-lg bg-slate-950 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-teal-300">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function DomainAnalysisReport({
  analysis,
}: {
  analysis: LatestDomainAnalysis | null;
}) {
  if (!analysis) {
    return <p className="mt-5 text-sm font-medium text-slate-500">No analysis yet</p>;
  }

  return (
    <div className="mt-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <AnalysisMetric label="Overall Score" value={formatScore(analysis.score)} />
        <AnalysisMetric label="Valuation" value={formatValuation(analysis.valuation)} />
        <AnalysisMetric label="Brand Score" value={formatScore(analysis.brand_score)} />
        <AnalysisMetric label="SEO Score" value={formatScore(analysis.seo_score)} />
        <AnalysisMetric
          label="Memorability Score"
          value={formatScore(analysis.memorability_score)}
        />
        <AnalysisMetric label="Trend Score" value={formatScore(analysis.trend_score)} />
        <AnalysisMetric
          label="Extension Quality"
          value={formatScore(analysis.extension_quality)}
        />
        <AnalysisMetric label="Keyword Value" value={formatScore(analysis.keyword_value)} />
      </div>

      <TextList title="Potential Buyers" items={analysis.buyer_profile} />
      <TextList title="Risk Analysis" items={analysis.risks} />
      <TextBlock title="Investment Thesis" value={analysis.investment_thesis} />
      <TextBlock title="AI Summary" value={analysis.ai_summary} />
    </div>
  );
}

function AnalysisMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function TextList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {items.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-slate-500">Not available</p>
      )}
    </div>
  );
}

function TextBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{value}</p>
    </div>
  );
}

function formatExtension(domain: Domain) {
  if (domain.extension) {
    return domain.extension.startsWith(".") ? domain.extension : `.${domain.extension}`;
  }

  const extension = domain.domain.split(".").pop();

  return extension && extension !== domain.domain ? `.${extension}` : "Unknown";
}

function formatFullDomain(domain: Domain, extension: string) {
  if (extension === "Unknown" || domain.domain.endsWith(extension)) {
    return domain.domain;
  }

  return `${domain.domain}${extension}`;
}

function formatStatus(status: string) {
  return status
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function formatValuation(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatScore(value: number) {
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDateTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
