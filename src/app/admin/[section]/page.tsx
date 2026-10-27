import Link from "next/link";
import { notFound } from "next/navigation";
import {
  requireStaff,
  checkedQuery,
  dateTime,
  fullDomain,
  money,
  statusLabels,
  type StaffAccess,
  type WorkspaceOrder,
} from "@/lib/workspace";
import {
  BrokerAccessForm,
  NewOrderForm,
  DomainStatusForm,
  ProfileForm,
  type PersonOption,
} from "@/components/workspace/forms";
import { Empty, PageTitle, panel } from "@/components/workspace/shell";
import { OrderCard } from "@/components/workspace/order-card";

const pageSize = 20;
function Pager({
  page,
  total,
  section,
  query,
}: {
  page: number;
  total: number;
  section: string;
  query: string;
}) {
  const link = (p: number) =>
    `/admin/${section}?${new URLSearchParams({ page: String(p), q: query })}`;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
      <span>
        共 {total} 条 · 第 {page} 页
      </span>
      <div className="flex gap-5">
        {page > 1 && <Link href={link(page - 1)}>← 上一页</Link>}
        {page * pageSize < total && <Link href={link(page + 1)}>下一页 →</Link>}
      </div>
    </div>
  );
}
export default async function AdminSection({
  params,
  searchParams,
}: {
  params: Promise<{ section: string }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { section } = await params;
  if (!["users", "domains", "reports", "orders", "audit"].includes(section))
    notFound();
  const { db } = await requireStaff("admin");
  const search = await searchParams;
  const page = Math.min(
    100000,
    Math.max(1, Number.parseInt(search.page ?? "1", 10) || 1),
  );
  const query = (search.q ?? "").trim().slice(0, 100).replace(/[%_]/g, "");
  const start = (page - 1) * pageSize;
  const searchForm = (
    <form className="flex gap-3">
      <label className="sr-only" htmlFor="search">
        搜索
      </label>
      <input
        id="search"
        name="q"
        defaultValue={query}
        placeholder={section === "users" ? "按用户邮箱搜索" : "按域名搜索"}
        className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
      />
      <button className="rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white">
        搜索
      </button>
      {query && (
        <Link
          className="self-center text-sm text-slate-500"
          href={`/admin/${section}`}
        >
          重置
        </Link>
      )}
    </form>
  );
  if (section === "users") {
    let request = db
      .from("profiles")
      .select("id,email,full_name,plan,created_at", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1);
    if (query) request = request.ilike("email", `%${query}%`);
    const result = await request;
    const people = checkedQuery(result) as (PersonOption & {
      plan: string;
      created_at: string;
    })[];
    const accessResult = await db
      .from("staff_access")
      .select("*")
      .in(
        "user_id",
        people.map((p) => p.id),
      );
    const accessRows = checkedQuery(accessResult) as StaffAccess[];
    return (
      <>
        <PageTitle
          eyebrow="People & access"
          title="用户与经纪人授权"
          description="仅管理员可以开通经纪人身份。勾选开通并保存后生效；取消开通会立即停用，已有订单保留供重新分配。"
        />
        {searchForm}
        {people.length ? (
          people.map((person) => {
            const access = accessRows.find((a) => a.user_id === person.id);
            return (
              <section key={person.id} className={panel}>
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="break-all font-semibold">{person.email}</h2>
                    <p className="mt-1 text-xs text-slate-400">
                      注册资料 {dateTime(person.created_at)} ·{" "}
                      {person.plan ?? "free"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                    {access?.role === "admin"
                      ? "全站管理员"
                      : access?.active
                        ? "经纪人 · 已开通"
                        : "普通用户 / 未开通"}
                  </span>
                </div>
                <ProfileForm person={person} />
                <div className="mt-5 border-t border-slate-100 pt-5">
                  {access?.role === "admin" ? (
                    <p className="text-sm text-slate-500">
                      管理员身份受保护，不通过经纪人授权表单修改。
                    </p>
                  ) : (
                    <BrokerAccessForm person={person} access={access} />
                  )}
                </div>
              </section>
            );
          })
        ) : (
          <Empty>没有匹配的用户。</Empty>
        )}
        <Pager
          page={page}
          total={result.count ?? 0}
          section={section}
          query={query}
        />
      </>
    );
  }
  if (section === "domains") {
    let request = db
      .from("domains")
      .select("id,user_id,domain,extension,status,created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1);
    if (query) request = request.ilike("domain", `%${query}%`);
    const result = await request;
    const domains = checkedQuery(result);
    const people = checkedQuery(
      await db
        .from("profiles")
        .select("id,email")
        .in(
          "id",
          domains.map((d) => d.user_id),
        ),
    );
    return (
      <>
        <PageTitle
          eyebrow="Domain inventory"
          title="全站域名资产"
          description="查看所有用户的域名，管理正常、暂缓、售出和归档状态。域名状态修改会自动记录在操作日志中。"
        />
        {searchForm}
        {domains.length ? (
          <div className="grid gap-4 md:grid-cols-2">
            {domains.map((domain) => (
              <section key={domain.id} className={panel}>
                <h2 className="break-all text-xl font-semibold">
                  {fullDomain(domain.domain ?? "", domain.extension)}
                </h2>
                <p className="mt-2 break-all text-sm text-slate-500">
                  所属用户：
                  {people.find((p) => p.id === domain.user_id)?.email ??
                    "资料缺失"}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  添加于 {dateTime(domain.created_at)}
                </p>
                <div className="mt-4">
                  <DomainStatusForm id={domain.id} status={domain.status} />
                </div>
              </section>
            ))}
          </div>
        ) : (
          <Empty>没有匹配的域名。</Empty>
        )}
        <Pager
          page={page}
          total={result.count ?? 0}
          section={section}
          query={query}
        />
      </>
    );
  }
  if (section === "orders") {
    let request = db
      .from("broker_orders")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1);
    if (query) request = request.ilike("domain_name", `%${query}%`);
    const result = await request;
    const orders = checkedQuery(result) as WorkspaceOrder[];
    const people = checkedQuery(
      await db.from("profiles").select("id,email").order("email").limit(1000),
    ) as PersonOption[];
    return (
      <>
        <PageTitle
          eyebrow="Order dispatch"
          title="委托与订单分配"
          description="统一受理域名出售与收购委托，进入订单详情指定经纪人或重新分配，并查看完整跟进记录。"
        />
        <details className={panel}>
          <summary className="cursor-pointer font-semibold">
            ＋ 为用户创建委托
          </summary>
          <div className="mt-5 max-w-2xl">
            <NewOrderForm people={people} />
          </div>
        </details>
        {searchForm}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
          {Object.values(statusLabels).map((title) => (
            <span
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5"
              key={title}
            >
              {title}
            </span>
          ))}
        </div>
        {orders.length ? (
          orders.map((order) => (
            <OrderCard key={order.id} order={order} base="/admin" />
          ))
        ) : (
          <Empty>暂无委托。用户可以在用户中心的“经纪委托”入口提交需求。</Empty>
        )}
        <Pager
          page={page}
          total={result.count ?? 0}
          section={section}
          query={query}
        />
      </>
    );
  }
  if (section === "reports") {
    const result = await db
      .from("domain_analysis")
      .select("id,domain_id,score,valuation,ai_summary,created_at", {
        count: "exact",
      })
      .order("created_at", { ascending: false })
      .range(start, start + pageSize - 1);
    const reports = checkedQuery(result);
    const domains = checkedQuery(
      await db
        .from("domains")
        .select("id,domain,extension")
        .in(
          "id",
          reports.map((r) => r.domain_id),
        ),
    );
    return (
      <>
        <PageTitle
          eyebrow="Analysis library"
          title="全站分析报告"
          description="查阅所有用户保存的历史 AI 分析。分数和估值是模型输出，不代表经核实的成交价。"
        />
        {reports.length ? (
          reports.map((report) => {
            const domain = domains.find((d) => d.id === report.domain_id);
            return (
              <article key={report.id} className={panel}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h2 className="text-xl font-semibold">
                    {domain
                      ? fullDomain(domain.domain ?? "", domain.extension)
                      : "域名已不存在"}
                  </h2>
                  <p className="text-sm font-semibold text-teal-700">
                    评分 {report.score ?? "—"} · 估值 {money(report.valuation)}
                  </p>
                </div>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
                  {report.ai_summary ?? "暂无摘要"}
                </p>
                <p className="mt-4 text-xs text-slate-400">
                  {dateTime(report.created_at)}
                </p>
              </article>
            );
          })
        ) : (
          <Empty>暂无分析报告。</Empty>
        )}
        <Pager
          page={page}
          total={result.count ?? 0}
          section={section}
          query=""
        />
      </>
    );
  }
  const result = await db
    .from("admin_audit_log")
    .select("*", { count: "exact" })
    .order("id", { ascending: false })
    .range(start, start + pageSize - 1);
  const logs = checkedQuery(result);
  const people = checkedQuery(
    await db
      .from("profiles")
      .select("id,email")
      .in("id", logs.map((log) => log.actor_id).filter(Boolean)),
  );
  const names: Record<string, string> = {
    "staff_access.insert": "开通经纪人 / 管理员",
    "staff_access.update": "调整经纪人权限",
    "broker_orders.insert": "创建委托",
    "broker_orders.update": "更新订单",
    "order_notes.insert": "添加内部跟进",
    "domains.update": "更新域名状态",
    "profiles.update": "更新用户资料",
  };
  return (
    <>
      <PageTitle
        eyebrow="Activity trail"
        title="操作日志"
        description="授权、分配、订单推进和资料修改自动留痕。日志仅管理员可读，后台不提供修改或删除入口。"
      />
      <section className={panel}>
        {logs.length ? (
          <div className="divide-y divide-slate-100">
            {logs.map((log) => (
              <article key={log.id} className="py-4 first:pt-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-semibold">
                    {names[log.action] ?? log.action}
                  </p>
                  <time className="text-xs text-slate-400">
                    {dateTime(log.created_at)}
                  </time>
                </div>
                <p className="mt-2 break-all text-sm text-slate-500">
                  {people.find((p) => p.id === log.actor_id)?.email ??
                    "系统初始化 / 未知用户"}{" "}
                  · 对象 {log.entity_id}
                </p>
                <p className="mt-2 break-all font-mono text-xs text-slate-400">
                  {JSON.stringify(log.details)}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <Empty>暂无操作日志。</Empty>
        )}
      </section>
      <Pager page={page} total={result.count ?? 0} section={section} query="" />
    </>
  );
}
