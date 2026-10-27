"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { AuthLayout } from "@/components/site-shell";

type AuthMessage = {
  type: "error" | "success";
  text: string;
} | null;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateLoginForm(email: string, password: string): string | null {
  const normalizedEmail = email.trim();

  if (!normalizedEmail) {
    return "Email is required.";
  }

  if (!emailPattern.test(normalizedEmail)) {
    return "Enter a valid email address.";
  }

  if (!password) {
    return "Password is required.";
  }

  return null;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<AuthMessage>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationError = validateLoginForm(email, password);

    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        signal: AbortSignal.timeout(40_000),
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setMessage({ type: "error", text: result.error ?? "登录失败，请稍后重试。" });
        return;
      }
      if (!["/admin", "/broker", "/dashboard"].includes(result.destination)) throw new Error("登录返回了无效的后台地址，请重试。");
      // Set-Cookie from the same-origin response is committed before this full navigation.
      window.location.replace(result.destination);
    } catch (error) {
      const errorMessage =
        error instanceof Error && ["TimeoutError", "AbortError", "TypeError"].includes(error.name) ? "登录连接超时或中断，请检查网络后重试。" : "登录未完成，请稍后重试。";

      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to access your domain intelligence dashboard."
    >
      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            className="mt-2 min-h-11 w-full rounded-lg border border-slate-200 px-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100"
          />
        </div>
        {message ? (
          <p
            role={message.type === "error" ? "alert" : "status"}
            className={`rounded-lg px-3 py-2 text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-teal-50 text-teal-700"
            }`}
          >
            {message.text}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isLoading}
          className="min-h-11 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-slate-600">
        New to hi.domains?{" "}
        <Link
          href="/signup"
          className="font-semibold text-teal-700 hover:text-teal-800"
        >
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
