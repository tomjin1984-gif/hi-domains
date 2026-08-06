import { createDomainAnalysisPrompt } from "@/lib/ai/prompt";

export interface DomainAnalyzerResult {
  score: number;
  valuation: number;
  brand_score: number;
  seo_score: number;
  summary: string;
}

const mockDomainAnalysis: DomainAnalyzerResult = {
  score: 80,
  valuation: 10000,
  brand_score: 85,
  seo_score: 75,
  summary: "Mock AI analysis",
};

export function analyzeDomain(domain: string): DomainAnalyzerResult {
  createDomainAnalysisPrompt(domain);

  return {
    ...mockDomainAnalysis,
  };
}
