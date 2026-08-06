import {
  AnalysisCard,
  AnalyzeCard,
  DashboardHeader,
  DashboardSidebar,
  OpportunityCard,
  RecentActivity,
  StatCard,
  WelcomeCard,
} from "@/components/dashboard";

const stats = [
  { label: "Total Domains", value: "128", accent: "teal" as const },
  { label: "Estimated Portfolio Value", value: "$420,000", accent: "amber" as const },
  { label: "Needs Attention", value: "12", accent: "rose" as const },
];

const recentAnalysis = [
  { domain: "chainscan.ai", score: 84, valueRange: "$7,500 - $25,000" },
  { domain: "agentmemory.ai", score: 91, valueRange: "$20,000 - $80,000" },
  { domain: "roboticslab.ai", score: 76, valueRange: "$3,000 - $12,000" },
];

const opportunities = ["Agent", "Memory", "Robotics", "AI Infrastructure"];

const activities = ["Domain analyzed", "Portfolio updated", "Report generated"];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="lg:flex">
        <DashboardSidebar />
        <div className="min-w-0 flex-1">
          <DashboardHeader />
          <main className="px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <div className="mx-auto max-w-7xl space-y-6">
              <WelcomeCard />
              <AnalyzeCard />

              <section>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-950">Portfolio Overview</h2>
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
                    <h2 className="text-lg font-semibold text-slate-950">Recent Analysis</h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Recent domain valuation examples for the static dashboard.
                    </p>
                  </div>
                  <div className="grid gap-4 lg:grid-cols-3 xl:grid-cols-1">
                    {recentAnalysis.map((analysis) => (
                      <AnalysisCard key={analysis.domain} {...analysis} />
                    ))}
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
