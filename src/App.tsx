import React, { useState } from "react";
import {
  Globe,
  Briefcase,
  Layers,
  Award,
  Zap,
  TrendingUp,
  FileCode,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  LogOut,
  User,
} from "lucide-react";
import { AuditResult } from "./types";
import ReportDashboard from "./components/ReportDashboard";
import InternshipSystem from "./components/InternshipSystem";
import AIChatbot from "./components/AIChatbot";
import LandingPage from "./components/LandingPage";

export default function App() {
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(() => {
    try {
      const stored = localStorage.getItem("ux_auditor_current_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<"auditor" | "internship">("auditor");
  const [targetUrl, setTargetUrl] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [showHtmlPaste, setShowHtmlPaste] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const handleLoginSuccess = (user: { email: string; name: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("ux_auditor_current_user", JSON.stringify(user));
    } catch (err) {
      console.warn("Storage error", err);
    }
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("ux_auditor_current_user");
    } catch (err) {
      console.warn("Storage error", err);
    }
  };

  // Simulated progress steps for loading state
  const loadingSteps = [
    "Establishing remote secure connection...",
    "Downloading HTML markup and assets tree...",
    "Parsing metadata, headers, script hierarchies, and images alt tags...",
    "Measuring FCP, Speed Index, LCP, and interactive performance indices...",
    "Assembling core Web Accessibility AA compliance vectors...",
    "Consulting Gemini AI heuristic evaluation engine for design audits...",
    "Calculating conversion risks and finalizing report dashboard...",
  ];

  const triggerAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setAuditResult(null);

    if (!targetUrl && !htmlContent) {
      setErrorMsg("Please enter a website URL or paste HTML source code to analyze.");
      return;
    }

    setIsLoading(true);
    setLoadingStep(0);

    // Animate loader text changes
    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1200);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl, htmlContent }),
      });

      const data = await res.json();
      clearInterval(stepInterval);

      if (!res.ok) {
        setErrorMsg(data.error || "A connection error occurred. Check server logs.");
        setIsLoading(false);
        return;
      }

      setAuditResult(data);
      setIsLoading(false);
    } catch (err: any) {
      clearInterval(stepInterval);
      setErrorMsg(err.message || "An error occurred during scanning. Make sure the backend is active.");
      setIsLoading(false);
    }
  };

  const handleApplyContribution = (url: string) => {
    setActiveTab("internship");
  };

  if (!currentUser) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col justify-between">
      {/* GLOBAL BANNER HEADER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-black shadow-lg shadow-white/5">
            <Layers className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="font-sans font-medium text-lg text-white tracking-tight flex items-center gap-1.5">
              UX<span className="text-[#888] font-light">AUDITOR</span><span className="text-xs align-top ml-1 text-orange-500">PRO</span>
            </h1>
            <p className="text-[10px] text-[#666] font-mono tracking-wider uppercase">
              Web Heuristic Evaluation Suite
            </p>
          </div>
        </div>

        {/* NAVIGATION TABS AND AUTH OPTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 text-xs bg-[#111] px-3.5 py-1.5 rounded-xl border border-[#222] text-slate-400">
            <User className="w-3.5 h-3.5 text-orange-400" />
            <span>Hi, <strong className="text-white font-semibold">{currentUser.name}</strong></span>
          </div>

          <nav className="flex items-center gap-1.5 bg-[#111] p-1 rounded-xl border border-[#222]">
            <button
              id="nav-tab-auditor"
              onClick={() => setActiveTab("auditor")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "auditor"
                  ? "bg-white text-black shadow-sm"
                  : "text-[#666] hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> 🌐 Auditor Engine
            </button>
            <button
              id="nav-tab-internship"
              onClick={() => setActiveTab("internship")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-xs transition-all cursor-pointer ${
                activeTab === "internship"
                  ? "bg-white text-black shadow-sm"
                  : "text-[#666] hover:text-white"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> 🎓 Open-Source Internship
            </button>
          </nav>

          <button
            onClick={handleLogOut}
            className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs hover:text-rose-400 transition-colors text-slate-500 font-mono font-semibold cursor-pointer border border-[#222] bg-[#0a0a0a]"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </header>

      {/* CORE FRAMEWORK BODY CONTAINER */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8 space-y-8">
        {activeTab === "auditor" ? (
          <div className="space-y-8">
            {/* SCANNER CONTROLLER CARD */}
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 md:p-8 space-y-6 print:hidden">
              <div className="space-y-1.5 max-w-2xl">
                <h2 className="text-xl md:text-2xl font-sans font-medium tracking-tight text-white">
                  Enter Web Address for instant AI Audit
                </h2>
                <p className="text-slate-400 text-sm">
                  Evaluates Nielsen Heuristics, WCAG standards, and projects load performance and business Conversion Risk immediately.
                </p>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-950/40 border border-rose-900/55 rounded-xl text-rose-300 text-xs font-semibold leading-relaxed">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={triggerAudit} className="space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3.5 top-3.5 w-5 h-5 text-[#555]" />
                    <input
                      id="input-url"
                      type="text"
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      placeholder="e.g. https://example.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-[#111] border border-[#333] text-[#e0e0e0] placeholder-[#555] outline-none focus:border-orange-500 shadow-sm text-sm font-sans"
                    />
                  </div>

                  <button
                    id="btn-trigger-audit"
                    type="submit"
                    disabled={isLoading}
                    className="bg-white hover:bg-orange-500 text-black font-bold uppercase text-xs tracking-widest py-3.5 px-6 rounded-xl transition-all shadow-md disabled:bg-[#222] disabled:text-[#555] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    {isLoading ? "Running Diagnostics..." : "Audit Webpage 🚀"}
                  </button>
                </div>

                {/* PRESET SPEED DIAL LINKS */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#777]">
                  <span className="font-sans">💡 Try recommended test sites:</span>
                  <button
                    type="button"
                    onClick={() => setTargetUrl("https://example.com")}
                    className="bg-[#111] hover:bg-white hover:text-black text-slate-300 px-2.5 py-1 rounded-lg border border-[#222] transition-all cursor-pointer font-mono text-[10px]"
                  >
                    example.com
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetUrl("https://news.ycombinator.com")}
                    className="bg-[#111] hover:bg-white hover:text-black text-slate-300 px-2.5 py-1 rounded-lg border border-[#222] transition-all cursor-pointer font-mono text-[10px]"
                  >
                    news.ycombinator.com
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetUrl("https://www.wikipedia.org")}
                    className="bg-[#111] hover:bg-white hover:text-black text-slate-300 px-2.5 py-1 rounded-lg border border-[#222] transition-all cursor-pointer font-mono text-[10px]"
                  >
                    wikipedia.org
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    id="btn-toggle-html-paste"
                    type="button"
                    onClick={() => setShowHtmlPaste(!showHtmlPaste)}
                    className="text-xs text-orange-400 hover:text-orange-300 font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    {showHtmlPaste ? "Hide Direct HTML Input Option" : "Need to paste HTML code source instead?"}
                  </button>
                  <span className="text-[10px] text-[#444] font-mono">Crawler Bypass mode enabled</span>
                </div>

                {showHtmlPaste && (
                  <div className="space-y-2 animate-fade-in">
                    <label className="text-xs font-bold text-slate-400 block">HTML Source Code</label>
                    <textarea
                      id="input-html-content"
                      rows={6}
                      value={htmlContent}
                      onChange={(e) => setHtmlContent(e.target.value)}
                      placeholder="Paste complete raw html source of the target webpage here (e.g. <html>...</html>)"
                      className="w-full p-4 rounded-xl bg-[#111] border border-[#333] text-orange-200 placeholder-[#555] outline-none focus:border-orange-500 text-xs font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block leading-relaxed font-sans">
                      Paste HTML if the live website is protected by Cloudflare/anti-bots, hosted locally, or requires logged-in views.
                    </span>
                  </div>
                )}
              </form>
            </div>

            {/* LOADING DIAGNOSTICS VIEW */}
            {isLoading && (
              <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-8 text-center space-y-6 max-w-xl mx-auto py-12">
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-[#222] border-t-orange-500 animate-spin" />
                  <Layers className="w-6 h-6 text-orange-500 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="font-sans font-bold text-white text-lg">Conducting Audits</h3>
                  <p className="text-orange-400 text-sm font-semibold animate-pulse">{loadingSteps[loadingStep]}</p>
                </div>

                <div className="w-full bg-[#111] border border-[#222] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-orange-500 h-full rounded-full transition-all duration-1000"
                    style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                  />
                </div>

                <p className="text-[10px] text-[#555] font-mono">
                  Diagnostics run time: ~3-5 seconds. Please do not close this browser session.
                </p>
              </div>
            )}

            {/* RESULTS VIEW */}
            {auditResult && !isLoading && (
              <ReportDashboard
                report={auditResult}
                onRequestContribute={handleApplyContribution}
              />
            )}

            {/* DEFAULT EMPTY STATE / MARKETING SUITE */}
            {!auditResult && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#111] border border-[#222] p-6 space-y-3 rounded-2xl shadow-sm">
                  <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-12 flex items-center justify-center border border-orange-500/20">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-bold text-white text-base">Core Web Vitals</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Estimates Page Load Time, Speed Index, First Contentful Paint, and Layout Shift based on HTML complexity, script count, and blocking tags.
                  </p>
                </div>

                <div className="bg-[#111] border border-[#222] p-6 space-y-3 rounded-2xl shadow-sm">
                  <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-12 flex items-center justify-center border border-emerald-500/20">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-bold text-white text-base">WCAG Compliance</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Evaluates missing image descriptions, heading nesting hierarchies, link clarity labels, and key accessible attributes.
                  </p>
                </div>

                <div className="bg-[#111] border border-[#222] p-6 space-y-3 rounded-2xl shadow-sm">
                  <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-12 flex items-center justify-center border border-blue-500/20">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h3 className="font-sans font-bold text-white text-base">Business Conversion ROI</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    Translates technical web performance and usability issues into annualized potential revenue losses, audience risks, and brand metrics.
                  </p>
                </div>

                {/* NIELSEN HEURISTICS QUICK-VIEW CARD */}
                <div className="bg-[#080808] text-white border border-[#222] rounded-2xl p-6 md:p-8 md:col-span-3 space-y-5">
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-lg text-orange-300">Nielsen Heuristic Evaluation Blueprint</h3>
                    <p className="text-xs text-slate-400">Our suite automatically evaluates your design patterns against Jakob Nielsen's 10 usability rules:</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {[
                      { num: "01", title: "System Status Visibility", desc: "Is current status transparent?" },
                      { num: "02", title: "Real World Match", desc: "Human concepts, not developer terms." },
                      { num: "03", title: "User Control & Freedom", desc: "Easy exit pathways & redos." },
                      { num: "04", title: "Consistency & Rules", desc: "No confusion on action phrases." },
                      { num: "05", title: "Error Prevention", desc: "Stops slips before they execute." },
                      { num: "06", title: "Recognition > Recall", desc: "Keep interface tools visual." },
                      { num: "07", title: "Flexibility of Actions", desc: "Accelerators for expert users." },
                      { num: "08", title: "Aesthetics & Minimalism", desc: "High visual white-space value." },
                      { num: "09", title: "Error Dialog Diagnostics", desc: "Helpful language, no code tags." },
                      { num: "10", title: "Help Documentation", desc: "Actionable onboarding guides." },
                    ].map((h, idx) => (
                      <div key={idx} className="bg-[#111] p-3.5 rounded-xl border border-[#222] space-y-1 hover:border-[#333] transition-colors">
                        <span className="text-[10px] text-[#555] font-mono font-bold block">{h.num}</span>
                        <span className="text-xs font-bold block text-orange-200">{h.title}</span>
                        <p className="text-[10px] text-slate-400 leading-normal">{h.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <InternshipSystem initialTargetUrl={targetUrl} />
        )}
      </main>

      {/* FOOTER METADATA */}
      <footer className="border-t border-[#222] bg-[#0a0a0a] py-6 text-center text-xs text-[#555] font-sans print:hidden">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[#666]">© 2026 AI UX & Accessibility Auditor. Built on Node, React, and Google Gemini AI.</p>
          <div className="flex items-center gap-4 text-[#444] font-semibold font-mono">
            <span className="text-[10px]">Version: 2.1.0</span>
            <span className="text-[10px]">Environment: Container Native</span>
          </div>
        </div>
      </footer>

      {/* GLOBAL FLOATING CHATBOT */}
      <AIChatbot auditContext={auditResult} />
    </div>
  );
}
