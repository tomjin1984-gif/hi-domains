import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  // Passwords are accepted only from the same-origin login form.
  let sameOrigin = false;
  try {
    const origin = new URL(request.headers.get("origin") ?? "");
    // Next.js may normalize nextUrl to localhost for a server bound to 127.0.0.1.
    sameOrigin = ["http:", "https:"].includes(origin.protocol) && origin.host === request.headers.get("host");
  } catch { /* Missing or malformed Origin is rejected. */ }
  if (!sameOrigin) {
    return NextResponse.json({ error: "请求来源不正确，请从本站登录页重试。" }, { status: 403 });
  }
  let body: unknown;
  try { body = await request.json(); } catch {
    return NextResponse.json({ error: "登录信息格式不正确。" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || !("email" in body) || !("password" in body) || typeof body.email !== "string" || typeof body.password !== "string" || body.email.length > 254 || body.password.length > 1024 || !body.password) {
    return NextResponse.json({ error: "请填写有效的邮箱和密码。" }, { status: 400 });
  }
  const db = await createClient();
  const { data, error } = await db.auth.signInWithPassword({ email: body.email.trim(), password: body.password });
  if (error || !data.user) {
    const unavailable = !error?.status || error.status >= 500;
    return NextResponse.json({ error: unavailable ? "登录服务暂时连接失败，请稍后重试。" : "登录失败，请检查邮箱、密码及邮箱确认状态。" }, { status: unavailable ? 503 : 401, headers: { "Cache-Control": "private, no-store" } });
  }
  const { data: access, error: accessError } = await db.from("staff_access").select("role,active").eq("user_id", data.user.id).maybeSingle();
  if (accessError) {
    return NextResponse.json({ error: "账号已验证，但后台权限暂时读取失败，请重新尝试登录。" }, { status: 503, headers: { "Cache-Control": "private, no-store" } });
  }
  const destination = access?.active && access.role === "admin" ? "/admin" : access?.active && access.role === "broker" ? "/broker" : "/dashboard";
  return NextResponse.json({ destination }, { headers: { "Cache-Control": "private, no-store" } });
}
