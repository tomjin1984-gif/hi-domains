"use server";

import { revalidatePath } from "next/cache";
import {
  requireStaff,
  getWorkspaceAccess,
  statusLabels,
} from "@/lib/workspace";

export type ActionResult = { error?: string; success?: string };
const uuid =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function field(form: FormData, key: string) {
  return String(form.get(key) ?? "").trim();
}
function refresh() {
  for (const path of ["/admin", "/broker", "/orders", "/dashboard"])
    revalidatePath(path, "layout");
}
function failure(error: { message: string; code?: string }): ActionResult {
  console.error("Workspace mutation failed", error.code, error.message);
  return { error: "操作未完成：请检查权限、订单状态和输入内容，刷新后重试。" };
}

export async function saveBrokerAccess(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const { db, user } = await requireStaff("admin");
  const userId = field(form, "user_id");
  if (!uuid.test(userId) || userId === user.id)
    return { error: "请选择其他已注册用户。" };
  const { data: existing, error: lookupError } = await db
    .from("staff_access")
    .select("role")
    .eq("user_id", userId)
    .maybeSingle();
  if (lookupError) return failure(lookupError);
  if (existing?.role === "admin")
    return { error: "此账号是管理员，不能在经纪人授权中修改。" };
  const values = {
    user_id: userId,
    role: "broker",
    active: form.get("active") === "on",
    can_accept_orders: form.get("can_accept_orders") === "on",
    can_update_orders: form.get("can_update_orders") === "on",
    can_add_notes: form.get("can_add_notes") === "on",
    granted_by: user.id,
  };
  const { error } = await db
    .from("staff_access")
    .upsert(values, { onConflict: "user_id" });
  if (error) return failure(error);
  refresh();
  return {
    success: values.active
      ? "经纪人授权已保存，即时生效。"
      : "经纪人权限已停用，未完成订单请重新分配。",
  };
}

export async function createOrder(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const { db, user, access } = await getWorkspaceAccess();
  const ownerId =
    access?.active && access.role === "admin"
      ? field(form, "owner_id") || user.id
      : user.id;
  const domain = field(form, "domain_name").toLowerCase();
  const service = field(form, "service_type");
  const brief = field(form, "brief");
  const rawBudget = field(form, "budget");
  const budget = rawBudget ? Number(rawBudget) : null;
  const labels = domain.split(".");
  if (
    !uuid.test(ownerId) ||
    domain.length > 253 ||
    labels.length < 2 ||
    !labels.every((label) =>
      /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(label),
    ) ||
    !/^[a-z]{2,63}$/.test(labels.at(-1) ?? "")
  )
    return {
      error: "请输入完整域名，例如 example.com（国际化域名请使用 Punycode）。",
    };
  if (
    !["sale", "acquisition"].includes(service) ||
    brief.length < 5 ||
    brief.length > 3000 ||
    (budget !== null &&
      (!Number.isFinite(budget) || budget < 0 || budget > 999999999999.99))
  )
    return { error: "请检查服务类型、预算和委托说明（5–3000字）。" };
  const { error } = await db
    .from("broker_orders")
    .insert({
      owner_id: ownerId,
      domain_name: domain,
      service_type: service,
      brief,
      budget,
    });
  if (error) return failure(error);
  refresh();
  return { success: "委托已创建，等待管理员分配经纪人。" };
}

export async function updateOrder(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const { db, access } = await getWorkspaceAccess();
  if (!access?.active) return { error: "你没有订单处理权限。" };
  const id = field(form, "order_id");
  const status = field(form, "status");
  const version = Number(field(form, "version"));
  if (
    !uuid.test(id) ||
    !statusLabels[status] ||
    !Number.isSafeInteger(version) ||
    version < 1
  )
    return { error: "订单参数不正确。" };
  const values: { status: string; broker_id?: string | null } = { status };
  if (access.role === "admin") {
    const brokerId = field(form, "broker_id");
    if (brokerId && !uuid.test(brokerId))
      return { error: "经纪人参数不正确。" };
    values.broker_id = status === "pending" ? null : brokerId || null;
  }
  const { data, error } = await db
    .from("broker_orders")
    .update(values)
    .eq("id", id)
    .eq("version", version)
    .select("id");
  if (error) return failure(error);
  if (!data?.length)
    return { error: "订单已被其他人更新或你已无权处理，请刷新后重试。" };
  refresh();
  return { success: "订单状态已更新。" };
}

export async function addOrderNote(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const { db, user, access } = await getWorkspaceAccess();
  if (!access?.active || (access.role === "broker" && !access.can_add_notes))
    return { error: "你没有添加跟进记录的权限。" };
  const orderId = field(form, "order_id");
  const body = field(form, "body");
  if (!uuid.test(orderId) || !body || body.length > 2000)
    return { error: "请填写1–2000字的跟进内容。" };
  const { error } = await db
    .from("order_notes")
    .insert({ order_id: orderId, author_id: user.id, body });
  if (error) return failure(error);
  refresh();
  return { success: "跟进记录已保存。" };
}

export async function updateDomainStatus(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const { db } = await requireStaff("admin");
  const id = field(form, "id");
  const status = field(form, "status");
  if (
    !uuid.test(id) ||
    !["active", "on_hold", "sold", "archived"].includes(status)
  )
    return { error: "域名状态不正确。" };
  const { data, error } = await db
    .from("domains")
    .update({ status })
    .eq("id", id)
    .select("id");
  if (error) return failure(error);
  if (!data?.length) return { error: "域名不存在或没有更新权限。" };
  refresh();
  return { success: "域名状态已保存。" };
}

export async function updateProfile(
  _: ActionResult,
  form: FormData,
): Promise<ActionResult> {
  const { db } = await requireStaff("admin");
  const id = field(form, "id");
  const fullName = field(form, "full_name");
  if (!uuid.test(id) || fullName.length > 100)
    return { error: "姓名最长100字。" };
  const { data, error } = await db
    .from("profiles")
    .update({ full_name: fullName || null })
    .eq("id", id)
    .select("id");
  if (error) return failure(error);
  if (!data?.length) return { error: "用户不存在。" };
  refresh();
  return { success: "用户资料已保存。" };
}
