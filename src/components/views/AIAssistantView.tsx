import React, { useState } from "react";
import { Bot, Sparkles, Send, Mic, RefreshCw, User, ShieldCheck, ArrowRight } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { askAIChat, getAIFinancialAnalysis, FinancialAnalysisResponse } from "../../services/aiService";
import { AIChatMessage } from "../../types";

export const AIAssistantView: React.FC = () => {
  const { totalIncome, totalExpense, healthScore, expenses, incomes, budgets } = useFinance();
  const { user } = useAuth();

  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<FinancialAnalysisResponse | null>(null);

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg_init",
      sender: "ai",
      text: `Hello ${user.name}! I am FinSmart AI, your context-aware financial literacy assistant. I've analyzed your profile (${user.occupation}) and current financial score (${healthScore}/100). How can I guide you today?`,
      timestamp: "Just now",
      suggestedActions: [
        "Run full AI audit on my monthly cashflow",
        "How do I optimize my food & dining budget?",
        "What are the best safe savings options for freshers?",
      ],
    },
  ]);

  const handleSend = async (customQuery?: string) => {
    const query = customQuery || inputMsg;
    if (!query.trim() || loading) return;

    const userMsg: AIChatMessage = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg("");
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.sender === "user" ? ("user" as const) : ("model" as const),
      content: m.text,
    }));

    const contextData = { totalIncome, totalExpense, healthScore, occupation: user.occupation };
    const replyText = await askAIChat(query, history, contextData);

    const aiMsg: AIChatMessage = {
      id: `ai_${Date.now()}`,
      sender: "ai",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, aiMsg]);
    setLoading(false);
  };

  const handleRunAnalysis = async () => {
    setAnalysisLoading(true);
    const financialSummary = {
      occupation: user.occupation,
      income: totalIncome,
      expenses: totalExpense,
      healthScore,
      budgetCategoryCount: budgets.length,
    };

    const res = await getAIFinancialAnalysis(financialSummary);
    setAiAnalysis(res);
    setAnalysisLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      {/* Left 2 Cols: Interactive Chat Interface */}
      <div className="lg:col-span-2 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                FinSmart AI Core
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              </h3>
              <p className="text-[10px] text-gray-400">Context-Aware Financial Literacy Engine</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
              Non-Speculative
            </span>
          </div>
        </div>

        {/* Message Log */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
              {m.sender === "ai" && (
                <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-blue-400" />
                </div>
              )}

              <div className={`max-w-[80%] ${m.sender === "user" ? "text-right" : "text-left"}`}>
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.sender === "user"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md shadow-blue-500/20"
                      : "bg-gray-950/80 border border-gray-800 text-gray-200 rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>

                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {m.suggestedActions.map((act, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(act)}
                        className="w-full text-left p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-xs font-medium flex items-center justify-between transition-colors"
                      >
                        <span>{act}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-gray-500 mt-1 block px-1">{m.timestamp}</span>
              </div>

              {m.sender === "user" && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-purple-300" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              FinSmart AI is formulating educational guidance...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-gray-950/90 border-t border-gray-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask AI about budget limits, emergency funds, FD interest rates..."
            className="flex-1 bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !inputMsg.trim()}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>

      {/* Right Col: AI Real-Time Audit Panel */}
      <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-5 backdrop-blur-xl flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center justify-between mb-3">
            <span>Automated AI Financial Audit</span>
            <button
              onClick={handleRunAnalysis}
              disabled={analysisLoading}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold shadow transition-all flex items-center gap-1"
            >
              {analysisLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : "Run Audit"}
            </button>
          </h3>

          {!aiAnalysis ? (
            <div className="p-6 rounded-2xl bg-gray-950/60 border border-gray-800 text-center text-xs text-gray-400 space-y-3">
              <Sparkles className="w-8 h-8 text-blue-400 mx-auto" />
              <p>Click "Run Audit" to analyze your active income, expense ratios, and savings milestones.</p>
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">AI Health Rating</span>
                  <span className="text-lg font-black text-white">{aiAnalysis.healthScore}/100</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs border border-emerald-500/20">
                  {aiAnalysis.healthStatus}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-blue-300 mb-1">Key AI Insights:</h4>
                <ul className="space-y-1 text-gray-300 text-[11px]">
                  {aiAnalysis.insights.map((ins, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-blue-400 shrink-0">•</span> {ins}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-amber-300 mb-1">Risk Observations:</h4>
                <ul className="space-y-1 text-gray-300 text-[11px]">
                  {aiAnalysis.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 shrink-0">•</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-emerald-300 mb-1">Recommended Action Plan:</h4>
                <ul className="space-y-1 text-gray-300 text-[11px]">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 shrink-0">•</span> {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <div className="p-3 rounded-2xl bg-gray-950/80 border border-gray-800 text-[11px] text-gray-400 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
          FinSmart AI strictly enforces non-speculative educational advice.
        </div>
      </div>
    </div>
  );
};
