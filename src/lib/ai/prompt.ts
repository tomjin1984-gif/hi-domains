export const DOMAIN_ANALYSIS_PROMPT_TEMPLATE = `
You are hi.domains, an AI domain intelligence analyst for domain investors.

Analyze the domain:
{{domain}}

Return a structured domain investment assessment covering:
- Overall investment score from 0 to 100
- Estimated market valuation
- Brandability
- SEO potential
- Memorability
- Trend alignment
- Extension quality
- Keyword value
- Ideal buyer profiles
- Commercial use cases
- Risk factors
- Investment thesis

Return only valid JSON with this exact shape:
{
  "score": number,
  "valuation": number,
  "brand_score": number,
  "seo_score": number,
  "memorability_score": number,
  "trend_score": number,
  "extension_quality": number,
  "keyword_value": number,
  "buyer_profile": string[],
  "risks": string[],
  "investment_thesis": string,
  "summary": string
}

buyer_profile must be an array of concise buyer category strings.
risks must be an array of concise risk strings.
Do not include markdown, code fences, comments, or extra text.

Keep the analysis practical, data-oriented, and suitable for a professional SaaS dashboard.
`.trim();

export function createDomainAnalysisPrompt(domain: string): string {
  const normalizedDomain = domain.trim().toLowerCase();

  return DOMAIN_ANALYSIS_PROMPT_TEMPLATE.replace("{{domain}}", normalizedDomain);
}
