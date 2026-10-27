import Link from "next/link";
import {
  requireStaff,
  checkedQuery,
  statusLabels,
  type WorkspaceOrder,
} from "@/lib/workspace";
import { Empty, PageTitle, Stats, panel } from "@/components/workspace/shell";
import { OrderCard } from "@/components/workspace/order-card";
export default async function BrokerPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { db, user, access } = await requireStaff("broker");
  const params = await searchParams;
  const status =
    params.status && statusLabels[params.status] ? params.status : "";
  const page = Math.min(
    100000,
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  );
  let request = db
    .from("broker_orders")
    .select("*", { count: "exact" })
    .eq("broker_id", user.id)
    .order("updated_at", { ascending: false })
    .range((page - 1) * 20, page * 20 - 1);
  if (status) request = request.eq("status", status);
  const result = await request;
  const orders = checkedQuery(result) as WorkspaceOrder[];
  const statuses = ["assigned", "accepted", "in_progress", "completed"];
  const counts = await Promise.all(
    statuses.map((s) =>
      db
        .from("broker_orders")
        .select("id", { count: "exact", head: true })
        .eq("broker_id", user.id)
        .eq("status", s),
    ),
  );
  if (counts.some((c) => c.error)) throw new Error("订单统计读取失败。");
  return (
    <>
      <PageTitle
        eyebrow="Broker desk"
        title="我的接单工作台"
        description="这里仅显示管理员分配给你的委托。先核对需求再接单，推进处理并记录关键沟通。"
      />
      <Stats
        items={statuses.map((s, i) => ({
          label: statusLabels[s],
          value: counts[i].count ?? 0,
        }))}
      />
      <section className={`${panel} flex flex-wrap gap-3 !py-4`}>
        <span className="text-sm font-semibold text-slate-700">当前权限</span>
        {[
          ["接单 / 拒单", access.can_accept_orders],
          ["推进状态", access.can_update_orders],
          ["添加跟进", access.can_add_notes],
        ].map(([title, allowed]) => (
          <span
            key={String(title)}
            className={`rounded-full px-3 py-1 text-xs ${allowed ? "bg-teal-50 text-teal-800" : "bg-slate-100 text-slate-400"}`}
          >
            {title} · {allowed ? "已开放" : "未开放"}
          </span>
        ))}
      </section>
      <nav className="flex flex-wrap gap-2">
        <Link
          href="/broker"
          className={`rounded-full border px-4 py-2 text-sm ${!status ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}
        >
          全部
        </Link>
        {Object.entries(statusLabels)
          .filter(([s]) => s !== "pending")
          .map(([s, title]) => (
            <Link
              key={s}
              href={`/broker?status=${s}`}
              className={`rounded-full border px-4 py-2 text-sm ${status === s ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white"}`}
            >
              {title}
            </Link>
          ))}
      </nav>
      {orders.length ? (
        orders.map((order) => (
          <OrderCard key={order.id} order={order} base="/broker" />
        ))
      ) : (
        <Empty>暂无符合条件的订单。管理员分配委托后会在这里显示。</Empty>
      )}
      <div className="flex justify-between text-sm text-slate-500">
        <span>
          共 {result.count ?? 0} 条 · 第 {page} 页
        </span>
        <div className="flex gap-4">
          {page > 1 && (
            <Link href={`/broker?page=${page - 1}&status=${status}`}>
              上一页
            </Link>
          )}
          {page * 20 < (result.count ?? 0) && (
            <Link href={`/broker?page=${page + 1}&status=${status}`}>
              下一页
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
