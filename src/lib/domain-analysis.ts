import "server-only";

import { createClient } from "@/lib/supabase/server";

export interface LatestDomainAnalysis {
  id: string;
  domain_id: string;
  score: number;
  valuation: number;
  brand_score: number;
  seo_score: number;
  ai_summary: string;
  created_at: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function parseDomainAnalysisRow(value: unknown): LatestDomainAnalysis | null {
  if (!isRecord(value)) {
    return null;
  }

  const { id, domain_id, score, valuation, brand_score, seo_score, ai_summary, created_at } =
    value;
  const parsedScore = parseNumber(score);
  const parsedValuation = parseNumber(valuation);
  const parsedBrandScore = parseNumber(brand_score);
  const parsedSeoScore = parseNumber(seo_score);

  if (
    typeof id !== "string" ||
    typeof domain_id !== "string" ||
    parsedScore === null ||
    parsedValuation === null ||
    parsedBrandScore === null ||
    parsedSeoScore === null ||
    typeof ai_summary !== "string" ||
    typeof created_at !== "string"
  ) {
    return null;
  }

  return {
    id,
    domain_id,
    score: parsedScore,
    valuation: parsedValuation,
    brand_score: parsedBrandScore,
    seo_score: parsedSeoScore,
    ai_summary,
    created_at,
  };
}

export async function getLatestDomainAnalysis(
  domainId: string,
): Promise<LatestDomainAnalysis | null> {
  const normalizedDomainId = domainId.trim();

  if (!normalizedDomainId) {
    return null;
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("domain_analysis")
    .select("id, domain_id, score, valuation, brand_score, seo_score, ai_summary, created_at")
    .eq("domain_id", normalizedDomainId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return null;
  }

  return parseDomainAnalysisRow(data);
}
