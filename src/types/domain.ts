export interface DomainAnalysis {
  id?: string;
  domain: string;
  createdAt?: string;
  overallScore: number;
  scores: {
    brandability: number;
    length: number;
    pronunciation: number;
    spelling: number;
    extension: number;
    commercial: number;
    liquidity: number;
    seo: number;
    risk: number;
  };
  valuation: {
    currency: string;
    wholesaleMin: number;
    wholesaleMax: number;
    retailMin: number;
    retailMax: number;
    suggestedListPrice: number;
    suggestedFloorPrice: number;
  };
  confidence: number;
  summary: string;
  recommendation: string;
  useCases: {
    title: string;
    description: string;
    fitScore: number;
  }[];
  buyerCategories: {
    category: string;
    reason: string;
    buyerPotential: string;
  }[];
  strengths: string[];
  weaknesses: string[];
  risks: {
    type: string;
    severity: string;
    explanation: string;
  }[];
  salesStrategy: {
    recommendedApproach: string;
    holdingPeriod: string;
    targetBuyerProfile: string;
    outreachAngle: string;
  };
}
