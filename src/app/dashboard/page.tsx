import {
  AddDomainCard,
  AnalyzeCard,
  DashboardHeader,
  DashboardSidebar,
  DomainCard,
  DomainEmptyState,
  OpportunityCard,
  RecentActivity,
  StatCard,
  WelcomeCard,
} from "@/components/dashboard";
import { getLatestDomainAnalysis } from "@/lib/domain-analysis";
import { getUserDomains } from "@/lib/domains";
import { getCurrentUserProfile } from "@/lib/user";
import Link from "next/link";
import { getWorkspaceAccess } from "@/lib/workspace";

const opportunities = ["Agent", "Memory", "Robotics", "AI Infrastructure"];

const activities = ["Domain analyzed", "Portfolio updated", "Report generated"];

function getStats(domainCount: number) {
  return [
    {
      label: "Total Domains",
      value: String(domainCount),
      accent: "teal" as const,
    },
    {
      label: "Estimated Portfolio Value",
      value: "$420,000",
      accent: "amber" as const,
    },
    { label: "Needs Attention", value: "12", accent: "rose" as const },
  ];
}

export default async function DashboardPage() {
  const { access } = await getWorkspaceAccess();
  const [profile, domains] = await Promise.all([
    getCurrentUserProfile(),
    getUserDomains(),
  ]);
  const domainAnalyses = await Promise.all(
    domains.map((domain) => getLatestDomainAnalysis(domain.id)),
  );
  const stats = getStats(domains.length);

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="lg:flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardHeader profile={profile} />
          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <WelcomeCard />
              <section className="flex flex-wrap items-center gap-3 rounded-xl border border-teal-100 bg-white p-4">
                <span className="mr-auto text-sm font-semibold text-slate-700">
                  域名经纪服务
                </span>
                <Link
                  href="/orders"
                  className="rounded-lg bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-800"
                >
                  我的经纪委托 →
                </Link>
                {access?.active && access.role === "admin" && (
                  <Link
                    href="/admin"
                    className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    全站管理员后台 →
                  </Link>
                )}
                {access?.active && access.role === "broker" && (
                  <Link
                    href="/broker"
                    className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                  >
                    经纪人接单后台 →
                  </Link>
                )}
              </section>
              <AddDomainCard />
              <AnalyzeCard />

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">
                      Portfolio Overview
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      High-level domain investment metrics.
                    </p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  {stats.map((stat) => (
                    <StatCard key={stat.label} {...stat} />
                  ))}
                </div>
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                <div>
                  <div className="mb-4">
                    <h2 className="text-lg font-semibold text-slate-950">
                      My Domains Portfolio
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Domains from your active portfolio.
                    </p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
                    {domains.length > 0 ? (
                      domains.map((domain, index) => (
                        <DomainCard
                          key={domain.id}
                          domain={domain}
                          analysis={domainAnalyses[index] ?? null}
                        />
                      ))
                    ) : (
                      <DomainEmptyState />
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <OpportunityCard keywords={opportunities} />
                  <RecentActivity items={activities} />
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
