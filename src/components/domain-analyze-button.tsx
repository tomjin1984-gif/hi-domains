"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AnalyzeStatus = "idle" | "loading" | "success" | "error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseErrorMessage(value: unknown) {
  if (!isRecord(value) || typeof value.error !== "string") {
    return null;
  }

  return value.error;
}

export function DomainAnalyzeButton({
  domain,
  displayDomain,
}: {
  domain: string;
  displayDomain: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<AnalyzeStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleAnalyze() {
    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });
      const payload = (await response.json()) as unknown;

      if (!response.ok) {
        setStatus("error");
        setMessage(parseErrorMessage(payload) ?? "Analysis failed.");
        return;
      }

      setStatus("success");
      setMessage(`Analysis saved for ${displayDomain}.`);
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Analysis request failed.");
    }
  }

  return (
    <div className="mt-5 space-y-3">
      <button
        type="button"
        onClick={handleAnalyze}
        disabled={status === "loading"}
        className="min-h-10 w-full rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
      >
        {status === "loading" ? "Analyzing..." : "Analyze"}
      </button>

      {status === "error" && message ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {message}
        </p>
      ) : null}

      {status === "success" && message ? (
        <p role="status" className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}
