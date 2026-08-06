import "server-only";

import { openai } from "@/lib/ai/openai";
import { createDomainAnalysisPrompt } from "@/lib/ai/prompt";

export interface DomainAnalyzerResult {
  score: number;
  valuation: number;
  brand_score: number;
  seo_score: number;
  memorability_score: number;
  trend_score: number;
  extension_quality: number;
  keyword_value: number;
  buyer_profile: string[];
  risks: string[];
  investment_thesis: string;
  summary: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function parseStringArray(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items = value.filter((item): item is string => typeof item === "string");

  return items.length === value.length ? items : null;
}

function parseOptionalNumber(value: unknown, fallback: number): number | null {
  return value === undefined || value === null ? fallback : parseNumber(value);
}

function parseOptionalString(value: unknown, fallback: string): string | null {
  return value === undefined || value === null ? fallback : parseString(value);
}

function parseOptionalStringArray(value: unknown): string[] | null {
  return value === undefined || value === null ? [] : parseStringArray(value);
}

function parseDomainAnalyzerResult(content: string): DomainAnalyzerResult | null {
  let parsed: unknown;

  try {
    parsed = JSON.parse(content);
  } catch (error) {
    console.error("JSON parse error:", error);
    console.error("Raw AI response:", content);
    return null;
  }

  if (!isRecord(parsed)) {
    return null;
  }

  const score = parseNumber(parsed.score);
  const valuation = parseNumber(parsed.valuation);
  const brandScore = parseNumber(parsed.brand_score);
  const seoScore = parseNumber(parsed.seo_score);
  const summary = parseString(parsed.summary);

  if (
    score === null ||
    valuation === null ||
    brandScore === null ||
    seoScore === null ||
    summary === null
  ) {
    console.error("Invalid AI result:", parsed);
    return null;
  }

  const memorabilityScore = parseOptionalNumber(parsed.memorability_score, brandScore);
  const trendScore = parseOptionalNumber(parsed.trend_score, score);
  const extensionQuality = parseOptionalNumber(parsed.extension_quality, seoScore);
  const keywordValue = parseOptionalNumber(parsed.keyword_value, score);
  const buyerProfile = parseOptionalStringArray(parsed.buyer_profile);
  const risks = parseOptionalStringArray(parsed.risks);
  const investmentThesis = parseOptionalString(parsed.investment_thesis, summary);

  if (
    memorabilityScore === null ||
    trendScore === null ||
    extensionQuality === null ||
    keywordValue === null ||
    buyerProfile === null ||
    risks === null ||
    investmentThesis === null
  ) {
    console.error("Invalid AI result:", parsed);
    return null;
  }

  return {
    score,
    valuation,
    brand_score: brandScore,
    seo_score: seoScore,
    memorability_score: memorabilityScore,
    trend_score: trendScore,
    extension_quality: extensionQuality,
    keyword_value: keywordValue,
    buyer_profile: buyerProfile,
    risks,
    investment_thesis: investmentThesis,
    summary,
  };
}

export async function analyzeDomain(domain: string): Promise<DomainAnalyzerResult | null> {
  const normalizedDomain = domain.trim().toLowerCase();

  if (!normalizedDomain) {
    return null;
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a domain intelligence API. Return only valid JSON matching the requested schema.",
        },
        {
          role: "user",
          content: createDomainAnalysisPrompt(normalizedDomain),
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      console.error("AI response content is empty");
      return null;
    }

    return parseDomainAnalyzerResult(content);
  } catch (error) {
    console.error("AI analyzer error:", error);
    return null;
  }
}
