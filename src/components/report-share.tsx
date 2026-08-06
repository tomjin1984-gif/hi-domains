"use client";

import { useState } from "react";

export function ReportShare({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function handleShare(platform: "twitter" | "linkedIn") {
    const encodedUrl = encodeURIComponent(window.location.href);
    const encodedTitle = encodeURIComponent(`${title} AI Domain Valuation Report`);
    const shareUrl =
      platform === "twitter"
        ? `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
        : `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Share Report
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="min-h-10 rounded-lg bg-teal-400 px-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-300"
        >
          {copied ? "Copied" : "Copy URL"}
        </button>
        <button
          type="button"
          onClick={() => handleShare("twitter")}
          className="min-h-10 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          Twitter/X
        </button>
        <button
          type="button"
          onClick={() => handleShare("linkedIn")}
          className="min-h-10 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
        >
          LinkedIn
        </button>
      </div>
    </div>
  );
}
