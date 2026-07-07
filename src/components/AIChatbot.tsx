import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  RefreshCw,
  Info,
  ChevronDown,
  Trash2,
  Code,
  ShieldCheck,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AuditResult } from "../types";

interface Message {
  role: "user" | "model";
  text: string;
}

interface AIChatbotProps {
  auditContext: AuditResult | null;
}

export default function AIChatbot({ auditContext }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I'm your **AI UX & Accessibility Assistant**. 🛡️✨\n\nHow can I help you optimize your web application today? If you run an audit on the dashboard, I can automatically analyze the results and help you write custom WCAG 2.1 compliance code, improve your performance metrics, or clarify Nielsen's Usability Heuristics!",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewMessageAlert, setHasNewMessageAlert] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Alert user when there's an active audit and they haven't opened the chat yet
  useEffect(() => {
    if (auditContext && !isOpen && messages.length <= 1) {
      setHasNewMessageAlert(true);
      // Add a contextual suggestion to start the chat
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `I noticed you just completed an audit for **${auditContext.title || auditContext.url}**! We have found some specific areas of improvement:\n\n- **Accessibility Score:** ${auditContext.summary?.accessibilityScore || 0}/100\n- **Performance Score:** ${auditContext.summary?.performanceScore || 0}/100\n- **UX Heuristics Score:** ${auditContext.summary?.uxHeuristicsScore || 0}/100\n\nWould you like me to explain any of these violations, or draft exact WCAG-compliant solutions to fix them?`,
        },
      ]);
    }
  }, [auditContext]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // Map current React messages structure to API history structure
      // api history: { role: 'user' | 'model', parts: [{ text: string }] }
      const history = messages.slice(1).map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history,
          auditContext,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch response");
      }

      setMessages((prev) => [
        ...prev,
        { role: "model", text: data.reply || "I couldn't generate a response." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: `⚠️ **Error connecting to AI:** ${err.message || "Something went wrong. Please check your API keys or network connection."}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleClearHistory = () => {
    if (window.confirm("Do you want to reset your conversation with the AI?")) {
      setMessages([
        {
          role: "model",
          text: "Conversation reset successfully! How can I assist you with accessibility or user experience design now?",
        },
      ]);
    }
  };

  const suggestions = auditContext
    ? [
        `Explain how to fix the missing img alt tags on ${auditContext.title || "this site"}.`,
        `Write code to resolve the head render-blocking scripts.`,
        "Explain the conversion risks of this audit report.",
        "How can I apply as a student to help resolve these bugs?",
      ]
    : [
        "What are Jakob Nielsen's 10 Usability Heuristics?",
        "Give me a WCAG 2.1 AA Checklist for web forms.",
        "How do I optimize Speed Index and TBT on mobile?",
        "What are some common screen reader accessibility errors?",
      ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] font-sans print:hidden">
      {/* FLOATING ACTION TRIGGER BUTTON */}
      {!isOpen && (
        <button
          id="btn-chatbot-toggle-open"
          onClick={() => {
            setIsOpen(true);
            setHasNewMessageAlert(false);
          }}
          className="relative bg-white hover:bg-orange-500 hover:scale-105 active:scale-95 text-black p-4 rounded-full shadow-2xl transition-all flex items-center justify-center cursor-pointer group"
        >
          {hasNewMessageAlert && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
            </span>
          )}
          <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-12" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-bold uppercase text-[10px] tracking-wider ml-0 group-hover:ml-2 whitespace-nowrap">
            AI Assistant
          </span>
        </button>
      )}

      {/* CHAT INTERACTIVE DRAWER/WINDOW */}
      {isOpen && (
        <div
          id="chatbot-drawer"
          className="bg-[#0b0b0b] border border-[#222] w-[380px] sm:w-[440px] h-[580px] rounded-2xl shadow-2xl flex flex-col justify-between overflow-hidden animate-fade-in"
        >
          {/* HEADER */}
          <div className="bg-[#111] border-b border-[#222] p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/10 text-orange-400 border border-orange-500/25 rounded-lg">
                <Sparkles className="w-4.5 h-4.5 animate-pulse" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-sm text-white flex items-center gap-1">
                  UX & Accessibility AI
                </h4>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  Gemini-3.5 Active
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="btn-chatbot-clear"
                onClick={handleClearHistory}
                className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                title="Clear Chat History"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                id="btn-chatbot-toggle-close"
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white p-1.5 rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* SYSTEM CONTEXT BAR */}
          {auditContext && (
            <div className="bg-orange-500/5 border-b border-orange-500/10 px-4 py-2 flex items-center justify-between text-[11px] text-orange-200/90">
              <span className="truncate max-w-[280px]">
                🎯 Analyzing: <strong>{auditContext.title || auditContext.url}</strong>
              </span>
              <span className="font-mono bg-orange-500/15 px-1.5 py-0.5 rounded text-[10px] text-orange-300">
                Score: {auditContext.summary?.overallScore || 0}
              </span>
            </div>
          )}

          {/* MESSAGE AREA */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0a0a0a]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.role !== "user" && (
                  <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs">
                    🛡️
                  </div>
                )}
                <div
                  className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white text-black rounded-tr-none"
                      : "bg-[#111] text-[#e0e0e0] border border-[#222] rounded-tl-none"
                  }`}
                >
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center shrink-0 text-xs">
                  🛡️
                </div>
                <div className="bg-[#111] border border-[#222] p-3.5 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-orange-500 rounded-full animate-bounce delay-0" />
                  <span className="h-1.5 w-1.5 bg-orange-500 rounded-full animate-bounce delay-150" />
                  <span className="h-1.5 w-1.5 bg-orange-500 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* SUGGESTION CHIPS */}
          <div className="p-3 border-t border-[#1a1a1a] bg-[#0a0a0a] space-y-1.5">
            <p className="text-[9px] uppercase tracking-wider font-mono text-[#555] font-semibold px-1">
              💡 Suggested Questions
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none snap-x">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestClick(s)}
                  className="bg-[#121212] hover:bg-[#1c1c1c] text-[#888] hover:text-orange-200 border border-[#222] rounded-lg px-2.5 py-1 text-[10px] whitespace-nowrap transition-colors cursor-pointer shrink-0 snap-start"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* INPUT FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-[#111] border-t border-[#222] flex gap-2"
          >
            <input
              id="chatbot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                auditContext
                  ? "Ask about WCAG issues, paint performance..."
                  : "How do I optimize speed index on mobile?..."
              }
              disabled={isLoading}
              className="flex-1 bg-[#0a0a0a] border border-[#222] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-600 outline-none focus:border-orange-500 disabled:opacity-50"
            />
            <button
              id="btn-chatbot-send"
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-white hover:bg-orange-500 disabled:bg-[#1a1a1a] text-black disabled:text-slate-700 p-2 rounded-xl transition-all shrink-0 flex items-center justify-center cursor-pointer"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
