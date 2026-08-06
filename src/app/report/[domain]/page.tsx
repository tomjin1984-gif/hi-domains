import Link from "next/link";
import { getLatestDomainAnalysis } from "@/lib/domain-analysis";
import type { LatestDomainAnalysis } from "@/lib/domain-analysis";
import { getPublicDomainByName } from "@/lib/domains";
import type { PublicDomain } from "@/lib/domains";

export default async function PublicDomainReportPage({
  params,
}: PageProps<"/report/[domain]">) {
  const { domain: domainParam } = await params;
  const domain = await getPublicDomainByName(domainParam);

  if (!domain) {
    return <ReportNotFound />;
  }

  const analysis = await getLatestDomainAnalysis(domain.id);
  const extension = formatExtension(domain);
  const fullDomain = formatFullDomain(domain, extension);

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PublicReportNav />

        <section className="rounded-xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-300">
                Public Domain Report
              </p>
              <h1 className="mt-3 truncate text-3xl font-semibold tracking-tight sm:text-4xl">
                {fullDomain}
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-300">
                AI-powered domain intelligence from hi.domains.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-slate-900 p-3 text-center">
              <HeaderMetric label="Extension" value={extension} />
              <HeaderMetric label="Status" value={formatStatus(domain.status)} />
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">AI Intelligence</h2>
          <PublicDomainAnalysisReport analysis={analysis} />
        </section>
      </div>
    </main>
  );
}

function ReportNotFound() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <PublicReportNav />
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm lg:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Public Domain Report
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            Domain report not found.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            This public report is unavailable or has not been published yet.
          </p>
        </section>
      </div>
    </main>
  );
}

function PublicReportNav() {
  return (
    <header className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-sm">
      <Link href="/" className="flex items-center gap-3" aria-label="hi.domains home">
        <span className="flex size-10 items-center justify-center rounded-lg bg-teal-400 text-sm font-bold text-slate-950">
          hi
        </span>
        <div>
          <p className="text-base font-semibold tracking-tight text-slate-950">hi.domains</p>
          <p className="text-xs text-slate-500">Domain Intelligence</p>
        </div>
      </Link>
      <Link
        href="/login"
        className="min-h-10 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Login
      </Link>
    </header>
  );
}

function PublicDomainAnalysisReport({
  analysis,
}: {
  analysis: LatestDomainAnalysis | null;
}) {
  if (!analysis) {
    return <p className="mt-5 text-sm font-medium text-slate-500">No analysis yet</p>;
  }

  return (
    <div className="mt-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

function HeaderMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-24 rounded-lg bg-slate-950 px-3 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-teal-300">{value}</p>
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

function formatExtension(domain: PublicDomain) {
  if (domain.extension) {
    return domain.extension.startsWith(".") ? domain.extension : `.${domain.extension}`;
  }

  const extension = domain.domain.split(".").pop();

  return extension && extension !== domain.domain ? `.${extension}` : "Unknown";
}

function formatFullDomain(domain: PublicDomain, extension: string) {
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
