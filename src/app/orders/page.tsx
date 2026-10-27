import Link from "next/link";
import {
  requireUser,
  checkedQuery,
  type WorkspaceOrder,
} from "@/lib/workspace";
import { NewOrderForm } from "@/components/workspace/forms";
import { PageTitle, Empty, panel } from "@/components/workspace/shell";
import { OrderCard } from "@/components/workspace/order-card";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "我的经纪委托 | hi.domains",
  robots: { index: false, follow: false },
};
export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { db, user } = await requireUser();
  const params = await searchParams;
  const page = Math.min(
    100000,
    Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1),
  );
  const result = await db
    .from("broker_orders")
    .select("*", { count: "exact" })
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })
    .range((page - 1) * 20, page * 20 - 1);
  const orders = checkedQuery(result) as WorkspaceOrder[];
  return (
    <main className="mx-auto max-w-5xl space-y-6 px-4 py-10 sm:px-6">
      <Link href="/dashboard" className="text-sm font-semibold text-teal-700">
        ← 返回用户中心
      </Link>
      <PageTitle
        eyebrow="Domain brokerage"
        title="我的经纪委托"
        description="提交域名出售或收购需求，由平台管理员安排经纪人跟进。这里可以查看你的委托和当前处理进度。"
      />
      <section className={panel}>
        <h2 className="mb-5 text-lg font-semibold">提交新委托</h2>
        <NewOrderForm />
      </section>
      <h2 className="text-xl font-semibold">历史委托</h2>
      {orders.length ? (
        orders.map((order) => <OrderCard key={order.id} order={order} />)
      ) : (
        <Empty>你还没有提交委托。</Empty>
      )}
      <div className="flex justify-between text-sm text-slate-500">
        <span>共 {result.count ?? 0} 条</span>
        <div className="flex gap-4">
          {page > 1 && <Link href={`/orders?page=${page - 1}`}>上一页</Link>}
          {page * 20 < (result.count ?? 0) && (
            <Link href={`/orders?page=${page + 1}`}>下一页</Link>
          )}
        </div>
      </div>
    </main>
  );
}
