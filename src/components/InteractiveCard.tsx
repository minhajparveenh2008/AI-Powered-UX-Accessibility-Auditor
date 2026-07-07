import React, { useState } from "react";
import { LucideIcon, RefreshCw, AlertTriangle, Lightbulb, ShieldAlert } from "lucide-react";

interface InteractiveCardProps {
  title: string;
  score: number;
  icon: LucideIcon;
  colorClass: string;
  frontSummary: string;
  suggestions: {
    ai: string;
    ruleBased: string;
    lighthouse: string;
  };
}

export default function InteractiveCard({
  title,
  score,
  icon: Icon,
  colorClass,
  frontSummary,
  suggestions,
}: InteractiveCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Determine score colors
  const getScoreColor = (val: number) => {
    if (val >= 90) return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
    if (val >= 70) return "text-amber-400 bg-amber-500/10 border-amber-500/20";
    return "text-rose-400 bg-rose-500/10 border-rose-500/20";
  };

  return (
    <div
      id={`flip-card-${title.toLowerCase().replace(/\s+/g, "-")}`}
      className="relative w-full h-[320px] group select-none"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full duration-500 ease-out transform-style-3d cursor-pointer ${
          isFlipped ? "rotate-y-180" : ""
        }`}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "none",
          transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {/* FRONT SIDE */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-[#111] rounded-2xl border border-[#222] shadow-sm hover:border-[#333] transition-colors p-6 flex flex-col justify-between"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[#151515] border border-[#222] text-[#888]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-sans font-medium text-white text-lg">
                  {title}
                </h3>
              </div>
              <div
                className={`px-3 py-1 text-sm font-bold font-mono rounded-full border ${getScoreColor(
                  score
                )}`}
              >
                {score}/100
              </div>
            </div>

            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {frontSummary}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3">
            <span className="text-xs text-[#555] font-mono flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-hover" /> Click card to flip
            </span>
            <span className="text-xs font-semibold text-orange-400 hover:text-orange-300">
              Show Suggestions →
            </span>
          </div>
        </div>

        {/* BACK SIDE (Flipped) */}
        <div
          className="absolute inset-0 w-full h-full backface-hidden bg-[#0d0d0d] text-[#e0e0e0] rounded-2xl border border-[#222] shadow-lg p-6 flex flex-col justify-between"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-[#1a1a1a] pb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-orange-400" />
                <h3 className="font-sans font-medium text-orange-300 text-base">
                  {title} Suggestions
                </h3>
              </div>
              <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase bg-[#111] border border-[#222] px-2 py-0.5 rounded">
                Suggestions Loaded
              </span>
            </div>

            <div className="space-y-3.5 overflow-y-auto max-h-[200px] pr-1 scrollbar-thin">
              {/* AI SUGGESTION */}
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-md bg-orange-500/10 text-orange-400 shrink-0 border border-orange-500/20">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-orange-200 block">AI Recommendation</span>
                  <p className="text-xs text-slate-300 leading-normal">{suggestions.ai}</p>
                </div>
              </div>

              {/* RULE-BASED SUGGESTION */}
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-md bg-amber-500/10 text-amber-400 shrink-0 border border-amber-500/20">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-200 block">Rule-Based Diagnostic</span>
                  <p className="text-xs text-slate-300 leading-normal">{suggestions.ruleBased}</p>
                </div>
              </div>

              {/* LIGHTHOUSE SUGGESTION */}
              <div className="flex gap-2.5 items-start">
                <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 shrink-0 border border-blue-500/20">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-blue-200 block">Lighthouse KPI Audit</span>
                  <p className="text-xs text-slate-300 leading-normal">{suggestions.lighthouse}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#1a1a1a] pt-3">
            <span className="text-[10px] text-[#555] font-mono">
              Click again to rotate back
            </span>
            <span className="text-xs font-semibold text-orange-400 hover:text-orange-300">
              ← Return
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
