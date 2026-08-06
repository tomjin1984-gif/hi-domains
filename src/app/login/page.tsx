import Link from "next/link";
import { AuthLayout } from "@/components/site-shell";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome back" subtitle="Login UI only. Authentication is not connected yet.">
      <form className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
          />
        </div>
        <button
          type="button"
          className="min-h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to hi.domains?{" "}
        <Link href="/signup" className="font-semibold text-teal-700 hover:text-teal-800">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
