"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type AnalysisResult = {
  score: number;
  valuation: number;
  brand_score: number;
  seo_score: number;
  summary: string;
};

type AnalyzeSuccessResponse = {
  success: true;
  analysis: AnalysisResult;
};

type AnalyzeErrorResponse = {
  success: false;
  error: string;
};

type AnalyzeResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;

type RequestStatus = "idle" | "loading" | "success" | "error";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseAnalysisResult(value: unknown): AnalysisResult | null {
  if (!isRecord(value)) {
    return null;
  }

  const score = parseNumber(value.score);
  const valuation = parseNumber(value.valuation);
  const brandScore = parseNumber(value.brand_score);
  const seoScore = parseNumber(value.seo_score);
  const summary = value.summary;

  if (
    score === null ||
    valuation === null ||
    brandScore === null ||
    seoScore === null ||
    typeof summary !== "string"
  ) {
    return null;
  }

  return {
    score,
    valuation,
    brand_score: brandScore,
    seo_score: seoScore,
    summary,
  };
}

function parseAnalyzeResponse(value: unknown): AnalyzeResponse | null {
  if (!isRecord(value) || typeof value.success !== "boolean") {
    return null;
  }

  if (value.success) {
    const analysis = parseAnalysisResult(value.analysis);

    return analysis ? { success: true, analysis } : null;
  }

  return typeof value.error === "string"
    ? { success: false, error: value.error }
    : null;
}

function formatValuation(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function DomainAnalyzer() {
  const [domain, setDomain] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedDomain = domain.trim().toLowerCase();

    if (!normalizedDomain) {
      setStatus("error");
      setErrorMessage("Domain is required.");
      setAnalysis(null);
      return;
    }

    setStatus("loading");
    setErrorMessage(null);
    setAnalysis(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: normalizedDomain,
        }),
      });

      const payload = parseAnalyzeResponse((await response.json()) as unknown);

      if (!payload) {
        setStatus("error");
        setErrorMessage("Invalid analysis response.");
        return;
      }

      if (!payload.success) {
        setStatus("error");
        setErrorMessage(payload.error);
        return;
      }

      setStatus("success");
      setAnalysis(payload.analysis);
    } catch {
      setStatus("error");
      setErrorMessage("Analysis request failed.");
    }
  }

  return (
    <div className="w-full space-y-4 lg:max-w-3xl">
      <form className="flex w-full flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="domain-analyzer-input">
          Domain
        </label>
        <input
          id="domain-analyzer-input"
          name="domain"
          type="text"
          value={domain}
          onChange={(event) => setDomain(event.target.value)}
          placeholder="Enter a domain name"
          autoComplete="off"
          className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100 sm:min-w-80"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-11 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "loading" ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {status === "error" && errorMessage ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      ) : null}

      {status === "success" && analysis ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p role="status" className="text-sm font-semibold text-slate-950">
            Analysis complete
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <Metric label="Score" value={String(analysis.score)} />
            <Metric label="Valuation" value={formatValuation(analysis.valuation)} />
            <Metric label="Brand" value={String(analysis.brand_score)} />
            <Metric label="SEO" value={String(analysis.seo_score)} />
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-600">{analysis.summary}</p>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}
