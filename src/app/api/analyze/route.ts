import { NextResponse } from "next/server";
import { analyzeDomain, type DomainAnalyzerResult } from "@/lib/ai/analyzer";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type AnalyzeSuccessResponse = {
  success: true;
  analysis: DomainAnalyzerResult;
};

type AnalyzeErrorResponse = {
  success: false;
  error: string;
};

type AnalyzeApiResponse = AnalyzeSuccessResponse | AnalyzeErrorResponse;

function errorResponse(error: string, status: number) {
  const response: AnalyzeErrorResponse = {
    success: false,
    error,
  };

  return NextResponse.json<AnalyzeApiResponse>(response, { status });
}

function successResponse(analysis: DomainAnalyzerResult) {
  const response: AnalyzeSuccessResponse = {
    success: true,
    analysis,
  };

  return NextResponse.json<AnalyzeApiResponse>(response);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseDomainFromBody(body: unknown): string | null {
  if (!isRecord(body) || typeof body.domain !== "string") {
    return null;
  }

  const domain = body.domain.trim().toLowerCase();

  return domain ? domain : null;
}

function parseDomainId(row: unknown): string | null {
  if (!isRecord(row) || typeof row.id !== "string") {
    return null;
  }

  return row.id;
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorResponse("User must be logged in", 401);
  }

  let body: unknown;

  try {
    body = (await request.json()) as unknown;
  } catch {
    return errorResponse("Invalid JSON body", 400);
  }

  const domain = parseDomainFromBody(body);

  if (!domain) {
    return errorResponse("Domain is required", 400);
  }

  const analysis = await analyzeDomain(domain);

  if (!analysis) {
    return errorResponse("AI analysis failed", 502);
  }

  const { data: domainRow, error: domainError } = await supabase
    .from("domains")
    .select("id")
    .eq("domain", domain)
    .eq("user_id", user.id)
    .maybeSingle();

  if (domainError) {
    return errorResponse("Failed to load domain", 500);
  }

  const domainId = parseDomainId(domainRow);

  if (!domainId) {
    return errorResponse("Domain not found", 404);
  }

  const { error: insertError } = await supabase.from("domain_analysis").insert({
    domain_id: domainId,
    score: analysis.score,
    valuation: analysis.valuation,
    brand_score: analysis.brand_score,
    seo_score: analysis.seo_score,
    memorability_score: analysis.memorability_score,
    trend_score: analysis.trend_score,
    extension_quality: analysis.extension_quality,
    keyword_value: analysis.keyword_value,
    buyer_profile: analysis.buyer_profile,
    risks: analysis.risks,
    investment_thesis: analysis.investment_thesis,
    ai_summary: analysis.summary,
  });

  if (insertError) {
    return errorResponse("Failed to save analysis", 500);
  }

  return successResponse(analysis);
}
