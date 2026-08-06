import "server-only";

import { openai } from "@/lib/ai/openai";
import { createDomainAnalysisPrompt } from "@/lib/ai/prompt";

export interface DomainAnalyzerResult {
  score: number;
  valuation: number;
  brand_score: number;
  seo_score: number;
  summary: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
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
  const summary = parsed.summary;

  if (
    score === null ||
    valuation === null ||
    brandScore === null ||
    seoScore === null ||
    typeof summary !== "string"
  ) {
    console.error("Invalid AI result:", parsed);
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
