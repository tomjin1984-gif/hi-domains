import Link from "next/link";
export default function AccessDenied() {
  return (
    <main className="mx-auto max-w-lg px-6 py-24">
      <p className="text-sm font-bold text-teal-700">hi.domains · 访问权限</p>
      <h1 className="mt-4 text-3xl font-semibold">此账号尚未获得后台权限</h1>
      <p className="mt-4 leading-7 text-slate-600">
        经纪人后台需由全站管理员指定开通。若权限已被停用，请联系管理员；普通用户仍可使用用户中心。
      </p>
      <div className="mt-7 flex gap-5">
        <Link href="/dashboard" className="font-semibold text-teal-700">
          返回用户中心
        </Link>
        <Link href="/login" className="text-slate-600">
          登录入口
        </Link>
      </div>
    </main>
  );
}
