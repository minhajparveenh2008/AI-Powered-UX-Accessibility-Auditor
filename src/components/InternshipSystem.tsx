import React, { useState, useEffect } from "react";
import {
  Briefcase,
  User,
  Mail,
  BookOpen,
  Code,
  Link as LinkIcon,
  Github,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Filter,
  Search,
  LogIn,
  LogOut,
  Sparkles,
} from "lucide-react";
import { User as AuthUser, ContributionApplication } from "../types";

interface InternshipSystemProps {
  initialTargetUrl: string;
}

export default function InternshipSystem({ initialTargetUrl }: InternshipSystemProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [authEmail, setAuthEmail] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState<"user" | "company">("user");
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState("");

  // Application Form State
  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [email, setEmail] = useState("");
  const [skills, setSkills] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [github, setGithub] = useState("");
  const [experience, setExperience] = useState("");
  const [targetUrl, setTargetUrl] = useState(initialTargetUrl);
  const [formMsg, setFormMsg] = useState("");
  const [formError, setFormError] = useState("");

  // Admin Dashboard State
  const [applications, setApplications] = useState<ContributionApplication[]>([]);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminFilterStatus, setAdminFilterStatus] = useState<string>("All");
  const [adminFilterSkills, setAdminFilterSkills] = useState<string>("All");

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("auditor_auth_user");
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        setCurrentUser(parsed);
        // Pre-fill application form values
        setName(parsed.name || "");
        setEmail(parsed.email || "");
      } catch (e) {
        localStorage.removeItem("auditor_auth_user");
      }
    }
    fetchApplications();
  }, []);

  useEffect(() => {
    if (initialTargetUrl) {
      setTargetUrl(initialTargetUrl);
    }
  }, [initialTargetUrl]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
      }
    } catch (err) {
      console.error("Failed to fetch contribution applications", err);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    if (!authEmail) {
      setAuthError("Please provide an email address.");
      return;
    }

    const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";
    const payload = isRegistering
      ? { email: authEmail, name: authName || authEmail.split("@")[0], role: authRole }
      : { email: authEmail };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || "Authentication failed.");
        return;
      }

      setCurrentUser(data.user);
      localStorage.setItem("auditor_auth_user", JSON.stringify(data.user));
      setName(data.user.name);
      setEmail(data.user.email);
      setAuthEmail("");
      setAuthName("");
    } catch (err) {
      setAuthError("Failed to connect to authentication server.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("auditor_auth_user");
  };

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg("");
    setFormError("");

    if (!currentUser) {
      setFormError("You must sign in to submit a contribution application.");
      return;
    }

    if (!name || !college || !email || !skills) {
      setFormError("Please fill out all required fields marked with *.");
      return;
    }

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          name,
          college,
          email,
          skills,
          portfolio,
          github,
          experience,
          targetUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || "Failed to submit request.");
        return;
      }

      setFormMsg(data.message);
      fetchApplications();
      // Clear secondary fields
      setCollege("");
      setSkills("");
      setPortfolio("");
      setGithub("");
      setExperience("");
    } catch (err) {
      setFormError("Could not connect to the database. Try again.");
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: "Approved 👍" | "Rejected ⚠️") => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchApplications();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update application status.");
      }
    } catch (err) {
      console.error("Error updating application status", err);
    }
  };

  // Filter calculations for admin panel
  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.college.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.skills.toLowerCase().includes(adminSearch.toLowerCase()) ||
      app.targetUrl.toLowerCase().includes(adminSearch.toLowerCase());

    const matchesStatus = adminFilterStatus === "All" || app.status === adminFilterStatus;
    const matchesSkills =
      adminFilterSkills === "All" || app.skills.toLowerCase().includes(adminFilterSkills.toLowerCase());

    return matchesSearch && matchesStatus && matchesSkills;
  });

  const myApplications = applications.filter((app) => currentUser && app.userId === currentUser.id);

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-4">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-5">
        <div>
          <h2 className="text-2xl md:text-3xl font-sans font-medium tracking-tight text-white">
            Open-Source Internship & Contribution System
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Sign in as a student to request contribution access or log in as a corporate reviewer to manage requests.
          </p>
        </div>

        {currentUser ? (
          <div className="flex items-center gap-3 bg-[#0a0a0a] px-4 py-2 rounded-xl border border-[#222] shadow-sm shrink-0">
            <div className="flex flex-col text-right">
              <span className="text-xs font-bold text-white font-sans">{currentUser.name}</span>
              <span className="text-[10px] text-orange-400 font-mono capitalize">Role: {currentUser.role}</span>
            </div>
            <button
              id="btn-logout"
              onClick={handleLogout}
              className="text-[#666] hover:text-rose-400 hover:bg-[#111] transition-colors p-1.5 rounded-lg cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        ) : (
          <div className="text-xs text-slate-500 font-mono">
            ⚠️ Not authenticated. Please complete the form below to register or log in.
          </div>
        )}
      </div>

      {/* NO USER SIGNED IN PANELS */}
      {!currentUser && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-[#0a0a0a] border border-[#222] shadow-sm rounded-2xl p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-white text-lg">
                {isRegistering ? "Student Registration & Application Portal" : "Sign In to Continue"}
              </h3>
              <p className="text-slate-400 text-sm">
                Access interactive coding tasks and track your review processes in real-time.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/55 rounded-xl text-rose-300 text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 font-sans block">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      id="auth-name"
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 font-sans block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    id="auth-email"
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="student@college.edu or company@brand.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                  />
                </div>
              </div>

              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 font-sans block">Select Account Role</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      id="role-select-student"
                      type="button"
                      onClick={() => setAuthRole("user")}
                      className={`py-2 px-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                        authRole === "user"
                          ? "bg-white border-white text-black shadow-sm"
                          : "bg-[#111] border-[#333] text-slate-400 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      🎓 Student / Contributor
                    </button>
                    <button
                      id="role-select-company"
                      type="button"
                      onClick={() => setAuthRole("company")}
                      className={`py-2 px-3 rounded-xl border font-bold text-xs text-center transition-all cursor-pointer ${
                        authRole === "company"
                          ? "bg-white border-white text-black shadow-sm"
                          : "bg-[#111] border-[#333] text-slate-400 hover:bg-[#1a1a1a]"
                      }`}
                    >
                      🏢 Company Admin / Reviewer
                    </button>
                  </div>
                </div>
              )}

              <button
                id="btn-auth-submit"
                type="submit"
                className="w-full bg-white hover:bg-orange-500 text-black font-bold uppercase text-[10px] tracking-widest py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4.5 h-4.5" /> {isRegistering ? "Register Account" : "Access Console"}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                id="btn-toggle-register"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setAuthError("");
                }}
                className="text-xs text-orange-400 font-semibold hover:underline cursor-pointer"
              >
                {isRegistering ? "Already registered? Sign In instead" : "Need to create a new profile? Register here"}
              </button>
            </div>
          </div>

          <div className="bg-[#080808] border border-[#222] text-white rounded-2xl p-6 md:p-8 space-y-5">
            <h3 className="font-sans font-bold text-lg text-orange-300">Why Join as a Contributor?</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-[#111] border border-[#222] rounded-lg text-orange-400 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Direct Open Source Experience</span>
                  <p className="text-xs text-slate-400 leading-normal">
                    Turn your analysis observations into structured GitHub Pull Requests. Collaborate directly with engineers on major UX issues.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-[#111] border border-[#222] rounded-lg text-orange-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Interactive Internships</span>
                  <p className="text-xs text-slate-400 leading-normal">
                    Students can earn valid university credit, corporate recommendation letters, and digital development certificates.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 bg-[#111] border border-[#222] rounded-lg text-orange-400 shrink-0">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold block text-white">Automated Reviewing Dashboard</span>
                  <p className="text-xs text-slate-400 leading-normal">
                    Review and verify applicants. Review engineering credentials, portfolio links, and approve requests directly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USER VIEW: SUBMISSION FORM & PORTAL */}
      {currentUser && currentUser.role === "user" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* APPLICATION FORM */}
          <div className="lg:col-span-7 bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 md:p-8 space-y-6">
            <div className="space-y-1">
              <h3 className="font-sans font-bold text-white text-xl">Internship / Contribution Application</h3>
              <p className="text-slate-400 text-xs">
                Apply to fix accessibility or UX issues on the webpage you recently analyzed.
              </p>
            </div>

            {formMsg && (
              <div className="p-4 bg-emerald-950/40 border border-emerald-900/55 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" /> {formMsg}
              </div>
            )}

            {formError && (
              <div className="p-3 bg-rose-950/40 border border-rose-900/55 rounded-xl text-rose-300 text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">Your Name *</label>
                  <input
                    id="apply-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full p-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">College / University *</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      id="apply-college"
                      type="text"
                      required
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="University of Design"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">Contact Email *</label>
                  <input
                    id="apply-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@college.edu"
                    className="w-full p-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">Target URL (Analyzed Webpage)</label>
                  <input
                    id="apply-targeturl"
                    type="text"
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Technical Skills *</label>
                <div className="relative">
                  <Code className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                  <input
                    id="apply-skills"
                    type="text"
                    required
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="React, CSS, WCAG 2.1, Core Web Vitals"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                  />
                </div>
                <span className="text-[10px] text-slate-500 block font-mono">Separate with commas (e.g. React, Tailwind, accessibility)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">GitHub Profile Link</label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      id="apply-github"
                      type="url"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/janedoe"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 block">Portfolio or Resume URL</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      id="apply-portfolio"
                      type="url"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://janedoe.com"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 block">Relevant Experience / Project Pitch</label>
                <textarea
                  id="apply-experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  rows={3}
                  placeholder="Explain why you want to fix this webpage or details about your open source experience."
                  className="w-full p-2.5 rounded-xl bg-[#111] border border-[#333] text-white placeholder-[#555] outline-none focus:border-orange-500 text-sm font-sans resize-none"
                />
              </div>

              <button
                id="btn-apply-submit"
                type="submit"
                className="w-full bg-white hover:bg-orange-500 text-black py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest transition-all shadow-lg cursor-pointer"
              >
                Submit Contribution Request
              </button>
            </form>
          </div>

          {/* MY APPLICATIONS STATUS LIST */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 space-y-4">
              <h3 className="font-sans font-bold text-white text-lg">My Submissions Status</h3>
              {myApplications.length > 0 ? (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {myApplications.map((app) => (
                    <div key={app.id} className="border border-[#222] rounded-xl p-4 bg-[#111] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500">ID: {app.id}</span>
                        <span
                          className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                            app.status === "Approved 👍"
                              ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                              : app.status === "Rejected ⚠️"
                              ? "bg-rose-950/40 text-rose-400 border-rose-900/50"
                              : "bg-amber-950/40 text-amber-400 border-amber-900/50"
                          }`}
                        >
                          {app.status}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-slate-500 font-medium">Target Webpage:</span>
                        <p className="text-xs font-semibold text-white truncate">{app.targetUrl || "General/Unlisted"}</p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-xs text-slate-500 font-medium">Your Declared Skills:</span>
                        <p className="text-xs text-slate-400 truncate">{app.skills}</p>
                      </div>

                      {app.status === "Approved 👍" && (
                        <div className="p-2.5 bg-emerald-950/30 rounded-lg border border-emerald-900/50 text-[11px] text-emerald-300 leading-relaxed">
                          🎉 <strong>Congratulations!</strong> Your application was approved. Check your contact email for next onboarding steps and git repository branch details.
                        </div>
                      )}

                      <div className="text-[10px] text-slate-500 font-mono text-right">
                        Submitted: {new Date(app.submittedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 border border-dashed border-[#222] rounded-xl text-slate-500 space-y-2">
                  <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs">No contribution requests found under your profile.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN VIEW: REVIEW & APPROVE PORTAL */}
      {currentUser && currentUser.role === "company" && (
        <div className="bg-[#0a0a0a] rounded-2xl border border-[#222] p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222] pb-4">
            <div>
              <h3 className="font-sans font-bold text-white text-xl">Corporate Review Board</h3>
              <p className="text-slate-400 text-xs mt-1">Review candidate identities, skillsets, portfolio links, and update approvals.</p>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-2 w-3.5 h-3.5 text-slate-500" />
                <input
                  id="admin-search"
                  type="text"
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  placeholder="Search applicants..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#222] bg-[#111] text-white outline-none focus:border-indigo-500 w-44 font-sans"
                />
              </div>

              <select
                id="admin-filter-status"
                value={adminFilterStatus}
                onChange={(e) => setAdminFilterStatus(e.target.value)}
                className="p-1.5 text-xs rounded-xl border border-[#222] bg-[#111] text-[#e0e0e0] outline-none focus:border-indigo-500 font-sans"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved 👍">Approved</option>
                <option value="Rejected ⚠️">Rejected</option>
              </select>

              <select
                id="admin-filter-skills"
                value={adminFilterSkills}
                onChange={(e) => setAdminFilterSkills(e.target.value)}
                className="p-1.5 text-xs rounded-xl border border-[#222] bg-[#111] text-[#e0e0e0] outline-none focus:border-indigo-500 font-sans"
              >
                <option value="All">All Core Skills</option>
                <option value="React">React</option>
                <option value="Tailwind">Tailwind</option>
                <option value="Accessibility">Accessibility</option>
                <option value="UX">UX / UI</option>
              </select>
            </div>
          </div>

          {/* APPLICATION CARDS LIST */}
          {filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredApplications.map((app) => (
                <div key={app.id} className="border border-[#222] rounded-xl p-5 hover:border-[#333] transition-all flex flex-col justify-between space-y-4 bg-[#111]/40">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-sans font-bold text-white text-base">{app.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono block">College: {app.college}</span>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full border ${
                          app.status === "Approved 👍"
                            ? "bg-emerald-950/40 text-emerald-400 border-emerald-900/50"
                            : app.status === "Rejected ⚠️"
                            ? "bg-rose-950/40 text-rose-400 border-rose-900/50"
                            : "bg-amber-950/40 text-amber-400 border-amber-900/50"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#222]">
                      <div>
                        <span className="text-slate-500 block font-medium">Contact:</span>
                        <a href={`mailto:${app.email}`} className="text-orange-400 hover:underline">{app.email}</a>
                      </div>
                      <div>
                        <span className="text-slate-500 block font-medium">Target URL:</span>
                        <span className="text-slate-300 truncate block max-w-[150px]" title={app.targetUrl}>{app.targetUrl || "General/Unlisted"}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs text-slate-500 block font-medium">Skills:</span>
                      <p className="text-xs text-white font-semibold truncate">{app.skills}</p>
                    </div>

                    {app.experience && (
                      <div className="bg-[#111] p-2.5 rounded-lg text-xs text-slate-300 leading-normal italic border-l border-orange-500/20">
                        "{app.experience}"
                      </div>
                    )}

                    <div className="flex gap-2.5 items-center pt-1 text-xs">
                      {app.github && (
                        <a
                          href={app.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold bg-[#111] border border-[#222] px-2.5 py-1 rounded-lg"
                        >
                          <Github className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                      {app.portfolio && (
                        <a
                          href={app.portfolio}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold bg-[#111] border border-[#222] px-2.5 py-1 rounded-lg"
                        >
                          <LinkIcon className="w-3.5 h-3.5" /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>

                  {app.status === "Pending" && (
                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#222]">
                      <button
                        id={`btn-approve-${app.id}`}
                        onClick={() => handleUpdateStatus(app.id, "Approved 👍")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs cursor-pointer text-center"
                      >
                        Approve Candidate 👍
                      </button>
                      <button
                        id={`btn-reject-${app.id}`}
                        onClick={() => handleUpdateStatus(app.id, "Rejected ⚠️")}
                        className="bg-[#151515] hover:bg-rose-950/25 border border-rose-900/50 text-rose-400 font-bold py-2 rounded-lg text-xs cursor-pointer text-center"
                      >
                        Reject Request ⚠️
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border border-dashed border-[#222] rounded-2xl text-slate-500 space-y-2">
              <Building className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-sm font-semibold text-slate-400">No applications matched current filters</p>
              <p className="text-xs text-slate-500">Try modifying search or filtering variables.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
