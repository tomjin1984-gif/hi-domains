"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type RequestStatus = "idle" | "loading" | "success" | "error";

type ParsedDomain = {
  domain: string;
  extension: string;
};

function normalizeDomainInput(value: string) {
  return value.trim().toLowerCase().replace(/^https?:\/\//, "").split(/[/?#]/)[0] ?? "";
}

function parseDomainInput(value: string): ParsedDomain | null {
  const normalized = normalizeDomainInput(value);

  if (!normalized || normalized.includes(" ") || normalized.includes("@")) {
    return null;
  }

  const labels = normalized.split(".");

  if (labels.length < 2 || labels.some((label) => label.length === 0)) {
    return null;
  }

  const extension = labels.at(-1);
  const domain = labels.slice(0, -1).join(".");

  if (!domain || !extension) {
    return null;
  }

  return {
    domain,
    extension: `.${extension}`,
  };
}

export function AddDomain() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const parsedDomain = useMemo(() => parseDomainInput(input), [input]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!parsedDomain) {
      setStatus("error");
      setMessage("Enter a complete domain such as vyoma.ai.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setStatus("error");
      setMessage("You must be signed in to add a domain.");
      return;
    }

    const { error } = await supabase.from("domains").insert({
      user_id: user.id,
      domain: parsedDomain.domain,
      extension: parsedDomain.extension,
      status: "active",
    });

    if (error) {
      setStatus("error");
      setMessage(error.message || "Failed to add domain.");
      return;
    }

    setInput("");
    setStatus("success");
    setMessage(`${parsedDomain.domain}${parsedDomain.extension} added to your portfolio.`);
    router.refresh();
  }

  return (
    <form className="w-full space-y-4 lg:max-w-3xl" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="add-domain-input">
          Domain
        </label>
        <input
          id="add-domain-input"
          name="domain"
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setStatus("idle");
            setMessage(null);
          }}
          placeholder="vyoma.ai"
          autoComplete="off"
          className="min-h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-teal-300 focus:ring-4 focus:ring-teal-100 sm:min-w-80"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="min-h-11 rounded-lg bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {status === "loading" ? "Adding..." : "Add Domain"}
        </button>
      </div>

      {parsedDomain ? (
        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          <p>
            <span className="font-medium text-slate-950">Domain:</span> {parsedDomain.domain}
          </p>
          <p>
            <span className="font-medium text-slate-950">Extension:</span>{" "}
            {parsedDomain.extension}
          </p>
        </div>
      ) : null}

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
    </form>
  );
}
