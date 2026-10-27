import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";

export const panel =
  "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6";
export function WorkspaceShell({
  role,
  email,
  children,
}: {
  role: "admin" | "broker";
  email: string;
  children: React.ReactNode;
}) {
  const links =
    role === "admin"
      ? [
          ["/admin", "运营总览"],
          ["/admin/users", "用户与经纪人授权"],
          ["/admin/domains", "全站域名"],
          ["/admin/reports", "分析报告"],
          ["/admin/orders", "委托与订单分配"],
          ["/admin/audit", "操作日志"],
        ]
      : [["/broker", "接单工作台"]];
  return (
    <div lang="zh-CN" className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-800 bg-slate-950 text-white lg:fixed lg:inset-y-0 lg:w-64 lg:border-r">
        <div className="px-6 py-7">
          <Link href="/" className="text-xl font-bold tracking-tight">
            hi<span className="text-teal-400">.</span>domains
          </Link>
          <p className="mt-2 text-xs tracking-widest text-slate-400">
            {role === "admin"
              ? "全站管理员 · CONTROL ROOM"
              : "经纪人 · BROKER DESK"}
          </p>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-5 lg:flex-col">
          {links.map(([href, title]) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-teal-300"
            >
              {title}
            </Link>
          ))}
        </nav>
        <div className="hidden px-6 lg:absolute lg:bottom-7 lg:block">
          <Link
            href="/dashboard"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← 返回用户中心
          </Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1 lg:pl-64">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 sm:px-8">
          <div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              {role === "admin" ? "管理员权限已验证" : "经纪人授权已验证"}
            </span>
            <p className="mt-2 break-all text-sm text-slate-500">{email}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-slate-500 hover:text-teal-700"
            >
              用户中心
            </Link>
            <LogoutButton />
          </div>
        </header>
        <main className="mx-auto max-w-7xl space-y-6 px-4 py-7 sm:px-8 sm:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-teal-700">
        {eyebrow}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}
export function Stats({
  items,
}: {
  items: { label: string; value: number | string }[];
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <div key={item.label} className={panel}>
          <p className="text-sm text-slate-500">{item.label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
export function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
      {children}
    </div>
  );
}
export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const style =
    status === "completed"
      ? "bg-teal-50 text-teal-800"
      : ["cancelled", "declined"].includes(status)
        ? "bg-rose-50 text-rose-700"
        : "bg-amber-50 text-amber-800";
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${style}`}
    >
      {label}
    </span>
  );
}
