"use client";
export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-8">
      <h2 className="text-xl font-semibold">暂时无法加载管理数据</h2>
      <p className="mt-3 text-slate-500">
        请检查连接后重试；系统不会将读取失败显示为空数据。
      </p>
      <button
        onClick={reset}
        className="mt-5 rounded-xl bg-slate-950 px-4 py-2 text-white"
      >
        重新加载
      </button>
    </div>
  );
}
