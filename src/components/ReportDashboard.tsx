import React, { useState } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import {
  Download,
  AlertCircle,
  TrendingUp,
  FileText,
  Search,
  Filter,
  ArrowUpRight,
  Clock,
  Layout,
  Layers,
  CheckCircle,
  Eye,
  Zap,
  DollarSign,
  Briefcase,
  Share2,
} from "lucide-react";
import { AuditResult, Finding } from "../types";
import InteractiveCard from "./InteractiveCard";

interface ReportDashboardProps {
  report: AuditResult;
  onRequestContribute: (targetUrl: string) => void;
}

export default function ReportDashboard({ report, onRequestContribute }: ReportDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { summary, businessImpact, competitorBenchmarking, cardSuggestions, findings } = report;

  // Format data for radar chart
  const radarData = [
    { subject: "Performance", score: summary.performanceScore, fullMark: 100 },
    { subject: "Accessibility", score: summary.accessibilityScore, fullMark: 100 },
    { subject: "UX Heuristics", score: summary.uxHeuristicsScore, fullMark: 100 },
    { subject: "SEO Score", score: summary.seoScore || 100, fullMark: 100 },
    { subject: "Business ROI", score: summary.businessImpactScore, fullMark: 100 },
  ];

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    const matchesSearch =
      f.issue.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.impact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === "All" || f.severity === selectedSeverity;
    const matchesCategory = selectedCategory === "All" || f.category === selectedCategory;
    return matchesSearch && matchesSeverity && matchesCategory;
  });

  // Export functions
  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `audit-report-${report.url.replace(/https?:\/\//, "").replace(/\//g, "-")}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Category,Severity,Issue,Impact,Recommendation,Business Impact\n";

    findings.forEach((f) => {
      const row = [
        f.category,
        f.severity,
        `"${f.issue.replace(/"/g, '""')}"`,
        `"${f.impact.replace(/"/g, '""')}"`,
        `"${f.recommendation.replace(/"/g, '""')}"`,
        `"${f.businessImpact.replace(/"/g, '""')}"`,
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", `audit-findings-${report.url.replace(/https?:\/\//, "").replace(/\//g, "-")}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const triggerPrintPDF = () => {
    window.print();
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case "Critical":
        return "bg-rose-950/40 text-rose-300 border-rose-900/50";
      case "High":
        return "bg-amber-950/40 text-amber-300 border-amber-900/50";
      case "Medium":
        return "bg-blue-950/40 text-blue-300 border-blue-900/50";
      default:
        return "bg-[#151515] text-slate-400 border-[#222]";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in print:bg-white print:text-black">
      {/* AUDIT SUMMARY HEADER BANNER */}
      <div className="bg-[#0a0a0a] text-[#e0e0e0] border border-[#222] rounded-2xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:bg-none print:text-slate-900 print:border print:border-slate-300">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-orange-500/10 text-orange-400 rounded-full border border-orange-500/20">
              {summary.siteCategory} Category
            </span>
            <span className="px-3 py-1 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
              Audit Complete
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-white print:text-slate-900">
            {report.title}
          </h2>
          <p className="text-slate-400 text-sm font-mono flex items-center gap-1">
            URL Analyzed: <a href={report.url} target="_blank" rel="noopener noreferrer" className="hover:underline text-orange-300">{report.url}</a>
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0 print:hidden">
          <button
            id="btn-export-pdf"
            onClick={triggerPrintPDF}
            className="flex items-center gap-2 bg-white hover:bg-orange-500 text-black px-4 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </button>
          <button
            id="btn-export-excel"
            onClick={exportCSV}
            className="flex items-center gap-2 bg-[#111] hover:bg-[#1a1a1a] text-slate-200 px-4 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-[#333] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV / Excel
          </button>
          <button
            id="btn-export-json"
            onClick={exportJSON}
            className="flex items-center gap-2 bg-[#111] hover:bg-[#1a1a1a] text-slate-200 px-4 py-2.5 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-[#333] transition-all cursor-pointer"
          >
            <Share2 className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* DETECTED OPPORTUNITIES & INTERNSHIP CALL-TO-ACTION */}
      <div className="bg-[#111] border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 print:hidden">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl shrink-0 border border-orange-500/20">
            <Briefcase className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="font-sans font-bold text-white text-lg">
              Want to get paid experience fixing these issues?
            </h3>
            <p className="text-slate-400 text-sm max-w-2xl">
              We identified <strong>{findings.length} issues</strong> on {report.title}. You can request to contribute as an open-source engineer or apply for an interactive development internship to resolve these errors under corporate guidance.
            </p>
          </div>
        </div>
        <button
          id="btn-request-contribute"
          onClick={() => onRequestContribute(report.url)}
          className="bg-white hover:bg-orange-500 text-black px-5 py-3.5 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer w-full md:w-auto justify-center"
        >
          Request to Contribute <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* CORE PERFORMANCE metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex flex-col justify-between">
          <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Page Load Time</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">{(summary.loadTimeMs / 1000).toFixed(2)}</span>
            <span className="text-xs text-slate-500">s</span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-500 flex items-center gap-1 font-mono"><Clock className="w-3 h-3" /> Estimate</span>
        </div>
        
        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex flex-col justify-between">
          <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">FCP (First Paint)</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">{(summary.fcpMs / 1000).toFixed(2)}</span>
            <span className="text-xs text-slate-500">s</span>
          </div>
          <span className={`mt-1.5 text-[10px] font-bold ${summary.fcpMs < 1500 ? "text-emerald-400" : "text-amber-400"}`}>
            {summary.fcpMs < 1500 ? "● Excellent" : "● Needs Improv."}
          </span>
        </div>

        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex flex-col justify-between">
          <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Speed Index</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">{(summary.speedIndexMs / 1000).toFixed(2)}</span>
            <span className="text-xs text-slate-500">s</span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-500 font-mono">Visual Index</span>
        </div>

        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex flex-col justify-between">
          <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Interactive (TTI)</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">{(summary.ttiMs / 1000).toFixed(2)}</span>
            <span className="text-xs text-slate-500">s</span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-500 font-mono">Response delay</span>
        </div>

        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex flex-col justify-between">
          <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Layout Shift (CLS)</span>
          <div className="mt-2">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">{summary.cls}</span>
          </div>
          <span className={`mt-1.5 text-[10px] font-bold ${summary.cls < 0.1 ? "text-emerald-400" : "text-rose-400"}`}>
            {summary.cls < 0.1 ? "● Highly Stable" : "● Shifting Layout"}
          </span>
        </div>

        <div className="bg-[#0a0a0a] p-4 rounded-xl border border-[#222] flex flex-col justify-between">
          <span className="text-[10px] text-[#555] font-bold uppercase tracking-wider">Parsed DOM Size</span>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-xl md:text-2xl font-bold font-mono text-white">{report.domSize}</span>
            <span className="text-xs text-slate-500">nodes</span>
          </div>
          <span className="mt-1.5 text-[10px] text-slate-500 font-mono">HTML Complexity</span>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RADAR CHART (UX & HEALTH DIMENSIONS) */}
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#222] flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="font-sans font-bold text-white text-lg">Evaluation Vector</h3>
            <p className="text-slate-500 text-xs mb-4">Multidimensional UX health indices across WCAG and Core Heuristics</p>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#222" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "#888", fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#444" }} />
                <Radar
                  name="Your Score"
                  dataKey="score"
                  stroke="#ea580c"
                  fill="#f97316"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COMPETITOR BENCHMARKING CHART */}
        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#222] flex flex-col justify-between h-[360px]">
          <div>
            <h3 className="font-sans font-bold text-white text-lg">Competitor Benchmarking</h3>
            <p className="text-slate-500 text-xs mb-4">Comparing scores against industry standards and leading competitors</p>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={competitorBenchmarking}
                margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
              >
                <XAxis dataKey="category" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "#444", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111", borderColor: "#222", color: "#fff" }} />
                <Legend iconSize={10} wrapperStyle={{ fontSize: 11, color: "#888" }} />
                <Bar dataKey="yourSite" name="Your Site" fill="#ffffff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="industryAvg" name="Industry Avg" fill="#333333" radius={[4, 4, 0, 0]} />
                <Bar dataKey="competitor" name="Top Competitor" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BUSINESS IMPACT SUMMARY */}
      <div className="bg-[#0a0a0a] text-white rounded-2xl p-6 md:p-8 border border-[#222]">
        <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-2 text-orange-400">
              <TrendingUp className="w-5 h-5" />
              <h3 className="font-sans font-bold text-lg">Business & Financial Risk Evaluation</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {businessImpact.roiAnalysis}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Conversion Risk</span>
                <span className={`text-base font-bold block ${businessImpact.conversionRisk === "High" || businessImpact.conversionRisk === "Critical" ? "text-rose-400" : "text-emerald-400"}`}>
                  {businessImpact.conversionRisk}
                </span>
              </div>
              <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Est. Revenue Loss</span>
                <span className="text-base font-bold text-rose-400 block">{businessImpact.estimatedRevenueLoss}</span>
              </div>
              <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Potential Lift</span>
                <span className="text-base font-bold text-emerald-400 block">{businessImpact.conversionLiftPotential}</span>
              </div>
              <div className="bg-[#111] p-3 rounded-xl border border-[#222]">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Brand Trust Grade</span>
                <span className="text-base font-bold text-orange-200 block">{businessImpact.brandTrustRating}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111]/30 p-6 rounded-2xl border border-[#222] flex flex-col items-center justify-center shrink-0 w-full lg:w-72">
            <span className="text-xs text-slate-500 font-mono uppercase tracking-wider">Business Impact Score</span>
            <div className="relative flex items-center justify-center mt-3">
              <span className="text-5xl font-extrabold font-mono text-white">{summary.businessImpactScore}</span>
              <span className="text-slate-500 font-mono text-xl">/100</span>
            </div>
            <div className="mt-4 w-full bg-[#222] rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-500 h-full rounded-full"
                style={{ width: `${summary.businessImpactScore}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 mt-2 text-center font-sans">
              Combines performance bounce risk and accessibility compliance levels.
            </span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE SUGGESTIONS (CARD FLIPS) */}
      <div className="space-y-4">
        <div>
          <h3 className="font-sans font-bold text-white text-xl">Interactive Technical Insights</h3>
          <p className="text-slate-500 text-sm">Flip cards to inspect automated developer recommendations and UX solutions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <InteractiveCard
            title="Performance"
            score={summary.performanceScore}
            icon={Zap}
            colorClass=""
            frontSummary="Analyzing blocking requests, script volumes, CSS structures, and DOM paint timings."
            suggestions={cardSuggestions.performance}
          />
          <InteractiveCard
            title="Accessibility"
            score={summary.accessibilityScore}
            icon={Eye}
            colorClass=""
            frontSummary="Validating image descriptive alt tags, structural headings order, outline focus, and WCAG specs."
            suggestions={cardSuggestions.accessibility}
          />
          <InteractiveCard
            title="UX Heuristics"
            score={summary.uxHeuristicsScore}
            icon={Layers}
            colorClass=""
            frontSummary="Auditing layout complexity, title descriptive qualities, user-flow consistency, and visual balance."
            suggestions={cardSuggestions.uxHeuristics}
          />
          <InteractiveCard
            title="SEO Audit"
            score={summary.seoScore || 100}
            icon={Search}
            colorClass=""
            frontSummary="Evaluating title length, meta description, viewport layout, open graph preview configurations, and robot directives."
            suggestions={cardSuggestions.seo}
          />
          <InteractiveCard
            title="ROI Impact"
            score={summary.businessImpactScore}
            icon={DollarSign}
            colorClass=""
            frontSummary="Quantifying the financial cost of technical glitches and layout dropoffs on sales goals."
            suggestions={cardSuggestions.businessImpact}
          />
        </div>
      </div>

      {/* QUICK WEBPAGE DOM STRUCTURAL METADATA DIAGNOSTICS */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 space-y-4">
        <h3 className="font-sans font-bold text-white text-lg">Webpage Diagnostics Log</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="border border-[#222] rounded-xl p-4 space-y-1 bg-[#111]">
            <span className="text-xs text-slate-500 font-medium">Headings Outline</span>
            <p className="text-sm font-semibold text-white">H1 Elements: {report.headings.h1.length}</p>
            <p className="text-xs text-slate-400">
              H2 Elements: {report.headings.h2Count} | H3 Elements: {report.headings.h3Count}
            </p>
            {report.headings.irregularOrder && (
              <span className="text-[10px] text-rose-400 font-bold block mt-1">⚠️ Heading order breaks standard nested layout</span>
            )}
          </div>

          <div className="border border-[#222] rounded-xl p-4 space-y-1 bg-[#111]">
            <span className="text-xs text-slate-500 font-medium">Image Elements alt tags</span>
            <p className="text-sm font-semibold text-white">Total Images: {report.images.total}</p>
            <p className="text-xs text-slate-400">
              Missing alt tags: <strong className="text-rose-400 font-mono">{report.images.missingAlt}</strong>
            </p>
            {report.images.missingAlt > 0 && (
              <span className="text-[10px] text-rose-400 font-bold block mt-1">⚠️ Accessibility (WCAG 2.1) violation detected</span>
            )}
          </div>

          <div className="border border-[#222] rounded-xl p-4 space-y-1 bg-[#111]">
            <span className="text-xs text-slate-500 font-medium">Script File Deliveries</span>
            <p className="text-sm font-semibold text-white">Total Scripts: {report.scripts.total}</p>
            <p className="text-xs text-slate-400">
              Head blocking scripts: <strong className="text-rose-400 font-mono">{report.scripts.blocking}</strong>
            </p>
            {report.scripts.blocking > 5 && (
              <span className="text-[10px] text-amber-400 font-semibold block mt-1">⚠️ Slow paint performance alert</span>
            )}
          </div>

          <div className="border border-[#222] rounded-xl p-4 space-y-1 bg-[#111]">
            <span className="text-xs text-slate-500 font-medium">SEO & Meta Index</span>
            <p className="text-sm font-semibold text-white">SEO Score: {summary.seoScore || 100}/100</p>
            <p className="text-xs text-slate-400">
              Title length: {report.title ? report.title.length : 0} chars
            </p>
            {(!report.title || report.title === "Untitled Webpage") && (
              <span className="text-[10px] text-rose-400 font-bold block mt-1">⚠️ Missing/empty webpage Title</span>
            )}
          </div>

          <div className="border border-[#222] rounded-xl p-4 space-y-1 bg-[#111]">
            <span className="text-xs text-slate-500 font-medium">Broken Links Scanner</span>
            <p className="text-sm font-semibold text-white">Total Links checked: {report.links.total}</p>
            <p className="text-xs text-slate-400">
              Failed/Broken targets: <strong className="font-mono text-rose-400">{report.links.brokenCount}</strong>
            </p>
            {report.links.brokenCount > 0 && (
              <span className="text-[10px] text-rose-400 font-bold block mt-1">⚠️ User-facing dead anchor links detected</span>
            )}
          </div>
        </div>

        {report.links.tested && report.links.tested.length > 0 && (
          <div className="mt-4 pt-3 border-t border-[#1a1a1a]">
            <span className="text-xs font-semibold text-[#888] block mb-2">Tested Link Status Sample:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {report.links.tested.map((t, idx) => (
                <div key={idx} className="bg-[#111] px-2.5 py-1.5 rounded-lg border border-[#222] text-xs font-mono flex items-center justify-between">
                  <span className="truncate text-slate-400 max-w-[150px]">{t.href}</span>
                  <span className={t.status.includes("Broken") ? "text-rose-400 font-bold" : "text-emerald-400"}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DETAILED FINDINGS TABLE WITH FILTER & SEARCH */}
      <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] overflow-hidden p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-sans font-bold text-white text-xl">Detailed Audit Log</h3>
            <p className="text-slate-500 text-sm">Review full diagnostics table, severity categorization, and recommendation scripts</p>
          </div>

          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#555]" />
              <input
                id="findings-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search findings..."
                className="pl-9 pr-4 py-2 text-xs rounded-xl border border-[#222] bg-[#111] text-white outline-none focus:border-orange-500 w-48 transition-all font-sans"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[#555]" />
              <select
                id="findings-filter-severity"
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="p-2 text-xs rounded-xl border border-[#222] bg-[#111] text-[#e0e0e0] outline-none focus:border-orange-500 font-sans"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                id="findings-filter-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 text-xs rounded-xl border border-[#222] bg-[#111] text-[#e0e0e0] outline-none focus:border-orange-500 font-sans"
              >
                <option value="All">All Categories</option>
                <option value="Performance">Performance</option>
                <option value="Accessibility">Accessibility</option>
                <option value="UX Heuristics">UX Heuristics</option>
                <option value="SEO">SEO</option>
              </select>
            </div>
          </div>
        </div>

        {/* TABLE COMPONENT */}
        <div className="overflow-x-auto border border-[#222] rounded-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#111] text-[#555] font-mono text-[10px] uppercase tracking-wider border-b border-[#222]">
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold">Issue Name</th>
                <th className="p-4 font-semibold">Impact on Users</th>
                <th className="p-4 font-semibold">Recommended Fix</th>
                <th className="p-4 font-semibold">Business Impact / ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151515] text-sm">
              {filteredFindings.length > 0 ? (
                filteredFindings.map((f) => (
                  <tr key={f.id} className="hover:bg-[#111]/30 transition-colors">
                    <td className="p-4 font-semibold text-white font-sans whitespace-nowrap">
                      {f.category}
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getSeverityBadge(f.severity)}`}>
                        {f.severity}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-white font-sans">
                      {f.issue}
                    </td>
                    <td className="p-4 text-slate-400 text-xs leading-normal max-w-xs">
                      {f.impact}
                    </td>
                    <td className="p-4 text-orange-200 text-xs font-mono bg-[#111] max-w-xs leading-relaxed border-l border-orange-500/20">
                      {f.recommendation}
                    </td>
                    <td className="p-4 text-rose-400 text-xs font-semibold font-sans">
                      {f.businessImpact}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 text-sm font-sans bg-[#0d0d0d]">
                    No findings matched the selected filters. Change search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
