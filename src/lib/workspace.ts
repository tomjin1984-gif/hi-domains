import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type StaffAccess = {
  user_id: string;
  role: "admin" | "broker";
  active: boolean;
  can_accept_orders: boolean;
  can_update_orders: boolean;
  can_add_notes: boolean;
};
export type WorkspaceOrder = {
  id: string;
  owner_id: string;
  contact_email: string | null;
  domain_name: string;
  service_type: "sale" | "acquisition";
  budget: number | null;
  brief: string;
  broker_id: string | null;
  status: string;
  version: number;
  created_at: string;
  updated_at: string;
};
export const statusLabels: Record<string, string> = {
  pending: "待分配",
  assigned: "待接单",
  accepted: "已接单",
  in_progress: "跟进中",
  completed: "已完成",
  declined: "已拒单",
  cancelled: "已取消",
};
export async function requireUser() {
  const db = await createClient();
  const {
    data: { user },
    error,
  } = await db.auth.getUser();
  if (error || !user) redirect("/login");
  return { db, user };
}
export async function getWorkspaceAccess() {
  const { db, user } = await requireUser();
  const { data, error } = await db
    .from("staff_access")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw new Error("无法读取后台权限，请稍后重试。");
  return { db, user, access: data as StaffAccess | null };
}
export async function requireStaff(role: "admin" | "broker") {
  const context = await getWorkspaceAccess();
  if (!context.access?.active || context.access.role !== role)
    redirect("/access-denied");
  return { ...context, access: context.access };
}
export function fullDomain(domain: string, extension: string | null) {
  const suffix = extension ? `.${extension.replace(/^\./, "")}` : "";
  return suffix && !domain.endsWith(suffix) ? `${domain}${suffix}` : domain;
}
export function dateTime(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    timeZone: "Asia/Shanghai",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
export function money(value: number | null) {
  return value === null
    ? "未填写"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(value);
}
export function checkedQuery<T>(result: { data: T | null; error: unknown }): T {
  if (result.error || result.data === null)
    throw new Error("数据加载失败，请刷新重试。");
  return result.data;
}
