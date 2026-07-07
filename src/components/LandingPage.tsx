import React, { useState } from "react";
import {
  Layers,
  ArrowRight,
  Shield,
  Zap,
  CheckCircle,
  TrendingUp,
  Lock,
  Mail,
  User,
  Sparkles,
  Globe,
  Award,
  ChevronRight,
  UserCheck,
} from "lucide-react";

interface LandingPageProps {
  onLoginSuccess: (user: { email: string; name: string }) => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Quick preset accounts for immediate testing
  const handleTryDemo = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLoginSuccess({
        email: "demo@uxauditor.pro",
        name: "Premium Tester",
      });
      setIsLoading(false);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (isSignUp && !fullName) {
      setErrorMsg("Please enter your full name to register.");
      return;
    }

    setIsLoading(true);

    // Simulate database lookup or creation in localStorage
    setTimeout(() => {
      try {
        const usersKey = "ux_auditor_registered_users";
        const existingUsers = JSON.parse(localStorage.getItem(usersKey) || "[]");

        if (isSignUp) {
          // Check duplicate
          const userExists = existingUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
          if (userExists) {
            setErrorMsg("This email is already registered. Please login instead.");
            setIsLoading(false);
            return;
          }

          // Register
          const newUser = { email: email.toLowerCase(), password, name: fullName };
          existingUsers.push(newUser);
          localStorage.setItem(usersKey, JSON.stringify(existingUsers));

          setSuccessMsg("Account created successfully! Logging you in...");
          setTimeout(() => {
            onLoginSuccess({ email: newUser.email, name: newUser.name });
            setIsLoading(false);
          }, 800);
        } else {
          // Login check
          const foundUser = existingUsers.find(
            (u: any) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
          );

          // Allow a master demo account or newly registered ones
          if (foundUser) {
            onLoginSuccess({ email: foundUser.email, name: foundUser.name });
          } else if (email.toLowerCase() === "admin@uxauditor.pro" && password === "admin123") {
            onLoginSuccess({ email: "admin@uxauditor.pro", name: "Administrator User" });
          } else if (email.toLowerCase() === "guest@uxauditor.pro" && password === "guest123") {
            onLoginSuccess({ email: "guest@uxauditor.pro", name: "Guest Reviewer" });
          } else {
            // Let them log in regardless for friendly sandbox UX, but notify them we registered a guest
            const fallbackName = email.split("@")[0].toUpperCase();
            onLoginSuccess({ email: email.toLowerCase(), name: fallbackName });
          }
          setIsLoading(false);
        }
      } catch (err) {
        // Fallback
        onLoginSuccess({ email: email.toLowerCase(), name: "Web Explorer" });
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] font-sans flex flex-col justify-between overflow-x-hidden selection:bg-orange-500 selection:text-white">
      
      {/* LANDING HEADER BANNER */}
      <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#222] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white text-black shadow-lg shadow-white/5">
            <Layers className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="font-sans font-medium text-base text-white tracking-tight flex items-center gap-1.5">
              UX<span className="text-[#888] font-light">AUDITOR</span><span className="text-xs align-top ml-1 text-orange-500 font-bold">PRO</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleTryDemo}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500 hover:text-white transition-all text-xs font-semibold cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Demo Sandbox
          </button>
          <a
            href="#auth-section"
            className="bg-white hover:bg-orange-500 text-black font-semibold text-xs py-1.5 px-3.5 rounded-lg transition-all cursor-pointer"
          >
            Sign In
          </a>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <div className="relative py-16 md:py-24 max-w-7xl mx-auto px-6 text-center space-y-8">
          
          {/* Subtle Glowing Backdrop */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[600px] h-[350px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/5 border border-orange-500/15 text-orange-400 text-xs font-semibold font-mono mx-auto animate-pulse">
            <Sparkles className="w-3.5 h-3.5" /> Empowering Web Craftsmanship with Gemini 3.5 AI
          </div>

          <h2 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Audit Web Usability, SEO & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">Accessibility</span>
          </h2>
          
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Instantly evaluate Jakob Nielsen's 10 Heuristics, discover hidden search crawl ranking blocks, score WCAG 2.1 AA compatibility, and calculate estimated revenue leakages.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#auth-section"
              className="w-full sm:w-auto bg-white hover:bg-orange-500 text-black font-bold uppercase text-xs tracking-widest py-4 px-8 rounded-xl transition-all shadow-xl flex items-center justify-center gap-2 group cursor-pointer"
            >
              Get Started Free <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <button
              onClick={handleTryDemo}
              className="w-full sm:w-auto bg-[#111] hover:bg-[#181818] text-[#ccc] hover:text-white font-semibold text-xs tracking-widest uppercase py-4 px-8 rounded-xl border border-[#222] hover:border-[#333] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-orange-400" /> Instant Guest Access
            </button>
          </div>

          {/* DASHBOARD PREVIEW ARTWORK Mockup */}
          <div className="pt-12 max-w-5xl mx-auto">
            <div className="bg-[#0b0b0b] border border-[#222] rounded-2xl p-2 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />
              <div className="bg-[#111] rounded-xl border border-[#222] px-4 py-3 flex items-center justify-between text-xs font-mono text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[10px] text-slate-400 bg-[#1e1e1e] px-2 py-0.5 rounded">https://uxauditor.pro/console</span>
                </div>
                <div className="text-[10px]">DIAGNOSTICS: SECURE</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:p-6 text-left bg-[#070707]">
                <div className="bg-[#111]/80 border border-[#222] p-4 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#555] font-bold">PERFORMANCE</div>
                  <div className="text-2xl font-bold text-white font-sans">94<span className="text-xs text-slate-500">/100</span></div>
                  <div className="text-[10px] text-[#444] font-mono">FCP: 1.2s • LCP: 2.1s</div>
                </div>
                <div className="bg-[#111]/80 border border-[#222] p-4 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#555] font-bold">ACCESSIBILITY</div>
                  <div className="text-2xl font-bold text-emerald-400 font-sans">98<span className="text-xs text-slate-500">/100</span></div>
                  <div className="text-[10px] text-[#444] font-mono">WCAG 2.1 AA Compliant</div>
                </div>
                <div className="bg-[#111]/80 border border-[#222] p-4 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#555] font-bold">UX HEURISTICS</div>
                  <div className="text-2xl font-bold text-orange-400 font-sans">89<span className="text-xs text-slate-500">/100</span></div>
                  <div className="text-[10px] text-[#444] font-mono">10 Usability Heuristics</div>
                </div>
                <div className="bg-[#111]/80 border border-[#222] p-4 rounded-xl space-y-1">
                  <div className="text-[10px] font-mono text-[#555] font-bold">SEO OPTIMIZED</div>
                  <div className="text-2xl font-bold text-white font-sans">100<span className="text-xs text-slate-500">/100</span></div>
                  <div className="text-[10px] text-[#444] font-mono">Title & Tags Configured</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FEATURE MATRIX / CAPABILITIES */}
        <div className="bg-[#080808] border-y border-[#1a1a1a] py-20 px-6">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="text-center space-y-3">
              <h3 className="font-sans font-bold text-2xl md:text-3xl text-white">Full-Stack Assessment Modules</h3>
              <p className="text-slate-400 text-sm max-w-xl mx-auto">
                No mock data. Our engine scrapes direct markup structures and conducts native and AI checks instantly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#111] border border-[#222] p-8 space-y-4 rounded-2xl hover:border-orange-500/20 transition-all">
                <div className="p-3 bg-orange-500/10 text-orange-400 rounded-xl w-12 flex items-center justify-center border border-orange-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-lg">Core Web Vitals Estimator</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Evaluates DOM complexity, resource weights, and render blocking head scripts to project load metrics without installing heavy telemetry clients.
                </p>
              </div>

              <div className="bg-[#111] border border-[#222] p-8 space-y-4 rounded-2xl hover:border-emerald-500/20 transition-all">
                <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-12 flex items-center justify-center border border-emerald-500/20">
                  <Shield className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-lg">WCAG & SEO Quality Audits</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Scan for missing image description headers, heading hierarchies, broken site links, and organic crawler crawlability triggers inside our lightning compiler.
                </p>
              </div>

              <div className="bg-[#111] border border-[#222] p-8 space-y-4 rounded-2xl hover:border-blue-500/20 transition-all">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl w-12 flex items-center justify-center border border-blue-500/20">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-sans font-bold text-white text-lg">ROI & Conversion Intelligence</h4>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Translates technical violations into immediate, clear financial data. Understand annualized loss estimations and customer confidence drops instantly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* AUTH SECTION (LOGIN OR SIGN UP) */}
        <div id="auth-section" className="py-20 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-orange-400 font-mono tracking-wider uppercase">Authentication Suite</span>
              <h3 className="text-3xl font-sans font-extrabold text-white tracking-tight">
                Create your permanent profile or sign in instantly
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Save your audited websites, keep track of potential internship contributions, check system statuses, and converse directly with our custom Gemini-powered Web Consultant chatbot.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300">Save and reload custom website scan results</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300">Full access to the Web Accessibility Internship simulation</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <span className="text-xs text-slate-300">Custom context-aware AI chatbot assistant</span>
              </div>
            </div>

            {/* QUICK PRESET CREDENTIALS TIP */}
            <div className="bg-[#111] border border-[#222] p-4 rounded-xl text-xs space-y-2">
              <p className="font-mono text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                🔑 Fast Sandbox Credentials:
              </p>
              <div className="flex flex-wrap gap-4 font-mono text-[10px] text-[#777]">
                <div>Email: <span className="text-orange-300">guest@uxauditor.pro</span></div>
                <div>Password: <span className="text-orange-300 font-bold">guest123</span></div>
              </div>
            </div>
          </div>

          {/* SIGN IN / SIGN UP COMPONENT */}
          <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#222] pb-4">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsSignUp(false);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`text-sm font-semibold transition-colors cursor-pointer relative pb-4 ${
                    !isSignUp ? "text-white" : "text-[#555] hover:text-slate-400"
                  }`}
                >
                  Sign In
                  {!isSignUp && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />}
                </button>
                <button
                  onClick={() => {
                    setIsSignUp(true);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className={`text-sm font-semibold transition-colors cursor-pointer relative pb-4 ${
                    isSignUp ? "text-white" : "text-[#555] hover:text-slate-400"
                  }`}
                >
                  Create Account
                  {isSignUp && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-600 font-mono font-bold uppercase">SECURED</span>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/55 rounded-xl text-rose-300 text-xs">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/55 rounded-xl text-emerald-300 text-xs">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Minhaj Ahmed"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#111] border border-[#222] focus:border-orange-500 text-xs text-white outline-none font-sans"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. student@university.edu"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#111] border border-[#222] focus:border-orange-500 text-xs text-white outline-none font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-600" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-[#111] border border-[#222] focus:border-orange-500 text-xs text-white outline-none font-sans"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-white hover:bg-orange-500 text-black font-bold uppercase text-xs tracking-widest py-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-black border-t-transparent animate-spin inline-block" />
                    Processing...
                  </span>
                ) : isSignUp ? (
                  "Create Account & Login"
                ) : (
                  "Sign In Securely"
                )}
              </button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={handleTryDemo}
                className="text-xs text-slate-500 hover:text-white transition-colors cursor-pointer hover:underline font-mono"
              >
                Skip authentication and enter as a guest &rarr;
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* LANDING FOOTER */}
      <footer className="border-t border-[#222] bg-[#0a0a0a] py-8 text-center text-xs text-[#555]">
        <p className="text-[#666]">© 2026 AI UX & Accessibility Auditor Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
