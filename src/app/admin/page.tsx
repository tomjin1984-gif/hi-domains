import Link from "next/link";
import { requireStaff } from "@/lib/workspace";
import { PageTitle, Stats, panel } from "@/components/workspace/shell";
export default async function AdminPage() {
  const { db } = await requireStaff("admin");
  const results = await Promise.all([
    db.from("profiles").select("id", { count: "exact", head: true }),
    db.from("domains").select("id", { count: "exact", head: true }),
    db
      .from("staff_access")
      .select("user_id", { count: "exact", head: true })
      .eq("role", "broker")
      .eq("active", true),
    db
      .from("broker_orders")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending"),
  ]);
  if (results.some((r) => r.error)) throw new Error("运营数据加载失败。");
  return (
    <>
      <PageTitle
        eyebrow="Platform operations"
        title="全站运营总览"
        description="集中管理用户、域名资产与经纪委托。所有经纪人权限均由此后台指定开通。"
      />
      <Stats
        items={["注册用户资料", "全站域名", "已开通经纪人", "待分配委托"].map(
          (label, i) => ({ label, value: results[i].count ?? 0 }),
        )}
      />
      <div className="grid gap-5 md:grid-cols-2">
        <section className={`${panel} !bg-slate-950 text-white`}>
          <p className="text-xs font-semibold tracking-widest text-teal-300">
            团队与权限
          </p>
          <h2 className="mt-4 text-xl font-semibold">
            把正确的订单交给正确的人
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            为已注册用户开通经纪人身份，分别设置接单、订单推进和跟进记录权限。停用后即时限制后台访问。
          </p>
          <Link
            href="/admin/users"
            className="mt-6 inline-block rounded-xl bg-teal-400 px-4 py-3 text-sm font-bold text-slate-950"
          >
            管理经纪人授权 →
          </Link>
        </section>
        <section className={panel}>
          <p className="text-xs font-semibold tracking-widest text-teal-700">
            委托工作流
          </p>
          <h2 className="mt-4 text-xl font-semibold">
            分配、跟进、交接，全程留痕
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            创建出售或收购委托，指定经纪人，查看接单与处理进度。授权变更和订单操作自动写入日志。
          </p>
          <Link
            href="/admin/orders"
            className="mt-6 inline-block rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"
          >
            进入订单管理 →
          </Link>
        </section>
      </div>
    </>
  );
}
