import Link from "next/link";
import {
  dateTime,
  money,
  statusLabels,
  type WorkspaceOrder,
} from "@/lib/workspace";
import { panel, StatusBadge } from "@/components/workspace/shell";
export function OrderCard({
  order,
  base,
}: {
  order: WorkspaceOrder;
  base?: "/admin" | "/broker";
}) {
  return (
    <article className={panel}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">
            {order.service_type === "sale" ? "域名出售委托" : "域名收购委托"} ·
            #{order.id.slice(0, 8)}
          </p>
          <h2 className="mt-2 break-all text-xl font-semibold">
            {order.domain_name}
          </h2>
        </div>
        <StatusBadge
          status={order.status}
          label={statusLabels[order.status] ?? order.status}
        />
      </div>
      <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">
        {order.brief}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
        <div className="text-xs text-slate-500">
          <span className="font-semibold text-slate-800">
            预算 {money(order.budget)}
          </span>
          <span className="mx-3">·</span>更新于 {dateTime(order.updated_at)}
        </div>
        {base && (
          <Link
            href={`${base}/orders/${order.id}`}
            className="text-sm font-semibold text-teal-700"
          >
            查看与处理 →
          </Link>
        )}
      </div>
    </article>
  );
}
