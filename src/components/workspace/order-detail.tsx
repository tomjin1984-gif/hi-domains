import { notFound } from "next/navigation";
import Link from "next/link";
import {
  requireStaff,
  checkedQuery,
  dateTime,
  type StaffAccess,
  type WorkspaceOrder,
} from "@/lib/workspace";
import {
  AdminOrderForm,
  BrokerOrderForm,
  NoteForm,
  type PersonOption,
} from "@/components/workspace/forms";
import { Empty, PageTitle, panel } from "@/components/workspace/shell";
import { OrderCard } from "@/components/workspace/order-card";
export async function OrderDetail({
  id,
  role,
}: {
  id: string;
  role: "admin" | "broker";
}) {
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const { db, access } = await requireStaff(role);
  const result = await db
    .from("broker_orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (result.error) throw new Error("订单读取失败。");
  if (!result.data) notFound();
  const order = result.data as WorkspaceOrder;
  const notes = checkedQuery(
    await db
      .from("order_notes")
      .select("id,body,author_id,created_at")
      .eq("order_id", id)
      .order("created_at", { ascending: false })
      .limit(500),
  ).reverse();
  let brokers: PersonOption[] = [];
  if (role === "admin") {
    const permissions = checkedQuery(
      await db
        .from("staff_access")
        .select("user_id")
        .eq("role", "broker")
        .eq("active", true)
        .eq("can_accept_orders", true),
    );
    brokers = checkedQuery(
      await db
        .from("profiles")
        .select("id,email")
        .in(
          "id",
          permissions.map((p) => p.user_id),
        ),
    ) as PersonOption[];
  }
  return (
    <>
      <Link
        href={role === "admin" ? "/admin/orders" : "/broker"}
        className="text-sm font-semibold text-teal-700"
      >
        ← 返回订单列表
      </Link>
      <PageTitle
        eyebrow="Order workspace"
        title="委托处理详情"
        description="核对需求，处理订单并记录跟进。客户联系方式只对管理员和当前获授权的负责经纪人开放。"
      />
      <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <OrderCard order={order} />
          <section className={panel}>
            <h2 className="font-semibold">委托联系信息</h2>
            <p className="mt-3 break-all text-sm text-slate-600">
              {order.contact_email ?? "暂无联系邮箱"}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              订单创建于 {dateTime(order.created_at)}
            </p>
          </section>
          <section className={panel}>
            <h2 className="text-lg font-semibold">内部跟进记录</h2>
            <p className="mt-2 text-xs text-slate-500">
              仅管理员和当前获授权的负责经纪人可见。最多展示最近500条。
            </p>
            <div className="mt-5 space-y-4">
              {notes.length ? (
                notes.map((note) => (
                  <article key={note.id} className="rounded-xl bg-slate-50 p-4">
                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                      {note.body}
                    </p>
                    <p className="mt-3 text-xs text-slate-400">
                      {dateTime(note.created_at)} ·{" "}
                      {note.author_id === order.broker_id
                        ? "负责经纪人"
                        : "管理员"}
                    </p>
                  </article>
                ))
              ) : (
                <Empty>尚无跟进记录。</Empty>
              )}
            </div>
            {(role === "admin" ||
              (access.can_add_notes &&
                !["completed", "cancelled", "declined"].includes(
                  order.status,
                ))) && <NoteForm orderId={id} />}
          </section>
        </div>
        <section className={panel}>
          <h2 className="mb-5 text-lg font-semibold">
            {role === "admin" ? "分配与管理" : "接单与处理"}
          </h2>
          {role === "admin" ? (
            <AdminOrderForm
              key={order.version}
              order={order}
              brokers={brokers}
            />
          ) : (
            <BrokerOrderForm
              key={order.version}
              order={order}
              access={access as StaffAccess}
            />
          )}
          <p className="mt-5 text-xs leading-5 text-slate-400">
            订单变更带版本检查，避免多人操作时覆盖彼此的进度。完成仅表示委托处理结束，不会执行资金或域名转移。
          </p>
        </section>
      </div>
    </>
  );
}
