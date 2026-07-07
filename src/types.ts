export interface AuditSummary {
  overallScore: number;
  performanceScore: number;
  accessibilityScore: number;
  uxHeuristicsScore: number;
  businessImpactScore: number;
  seoScore: number;
  siteCategory: string;
  loadTimeMs: number;
  speedIndexMs: number;
  fcpMs: number;
  ttiMs: number;
  tbtMs: number;
  cls: number;
}

export interface BusinessImpactStats {
  conversionRisk: string;
  estimatedRevenueLoss: string;
  conversionLiftPotential: string;
  brandTrustRating: string;
  roiAnalysis: string;
}

export interface CompetitorBenchmark {
  category: string;
  yourSite: number;
  industryAvg: number;
  competitor: number;
}

export interface CardSuggestions {
  performance: { ai: string; ruleBased: string; lighthouse: string };
  accessibility: { ai: string; ruleBased: string; lighthouse: string };
  uxHeuristics: { ai: string; ruleBased: string; lighthouse: string };
  businessImpact: { ai: string; ruleBased: string; lighthouse: string };
  seo: { ai: string; ruleBased: string; lighthouse: string };
}

export interface Finding {
  id: string;
  category: "Performance" | "Accessibility" | "UX Heuristics" | "SEO";
  severity: "Critical" | "High" | "Medium" | "Low";
  issue: string;
  impact: string;
  recommendation: string;
  businessImpact: string;
}

export interface AuditResult {
  success: boolean;
  url: string;
  title: string;
  domSize: number;
  scripts: {
    total: number;
    blocking: number;
  };
  images: {
    total: number;
    missingAlt: number;
    sample: Array<{ src: string; alt: string | null; hasAlt: boolean }>;
  };
  links: {
    total: number;
    brokenCount: number;
    broken: string[];
    tested: Array<{ href: string; status: string }>;
  };
  headings: {
    h1: string[];
    h2Count: number;
    h3Count: number;
    irregularOrder: boolean;
  };
  summary: AuditSummary;
  businessImpact: BusinessImpactStats;
  competitorBenchmarking: CompetitorBenchmark[];
  cardSuggestions: CardSuggestions;
  findings: Finding[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "company";
}

export interface ContributionApplication {
  id: string;
  userId: string;
  name: string;
  college: string;
  email: string;
  skills: string;
  portfolio: string;
  github: string;
  experience: string;
  targetUrl: string;
  status: "Pending" | "Approved 👍" | "Rejected ⚠️";
  submittedAt: string;
}
