import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Sparkles, X, Send, User, RefreshCw, ChevronRight } from "lucide-react";
import { useUI } from "../../context/UIContext";
import { useFinance } from "../../context/FinanceContext";
import { askAIChat } from "../../services/aiService";
import { AIChatMessage } from "../../types";

export const FloatingAIButton: React.FC = () => {
  const { aiModalOpen, setAiModalOpen, setActiveTab } = useUI();
  const { totalIncome, totalExpense, healthScore } = useFinance();

  const [inputMsg, setInputMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: "msg_1",
      sender: "ai",
      text: "Hello! I am FinSmart AI, your educational financial advisor. Ask me anything about budgeting, emergency funds, 50/30/20 allocation, or safe savings options!",
      timestamp: "Just now",
      suggestedActions: [
        "How should I structure my emergency fund?",
        "Explain the 50/30/20 budgeting rule",
        "What are the benefits of Fixed Deposits?",
      ],
    },
  ]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMsg;
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

    const contextData = { totalIncome, totalExpense, healthScore };
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

  return (
    <>
      {/* Floating Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setAiModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl shadow-blue-500/40 border border-blue-400/30 flex items-center gap-2.5 group cursor-pointer"
      >
        <div className="relative">
          <Bot className="w-6 h-6 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
        </div>
        <span className="text-xs font-bold hidden sm:inline-block pr-1">Ask FinSmart AI</span>
      </motion.button>

      {/* Drawer Modal */}
      <AnimatePresence>
        {aiModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[520px] bg-gray-900/95 border border-gray-800 rounded-3xl shadow-2xl z-50 backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-gray-950/80 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    FinSmart AI Assistant
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </h3>
                  <p className="text-[10px] text-gray-400">Non-Speculative Financial Advisor</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    setAiModalOpen(false);
                    setActiveTab("ai_assistant");
                  }}
                  className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 text-[10px] font-semibold border border-blue-500/20"
                >
                  Full View
                </button>
                <button
                  onClick={() => setAiModalOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scrollbar">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-2.5 ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "ai" && (
                    <div className="w-7 h-7 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-blue-400" />
                    </div>
                  )}

                  <div className={`max-w-[82%] ${m.sender === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`p-3 rounded-2xl text-xs leading-relaxed ${
                        m.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none"
                          : "bg-gray-800/80 border border-gray-700/60 text-gray-200 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>

                    {/* Suggested prompts buttons */}
                    {m.suggestedActions && m.suggestedActions.length > 0 && (
                      <div className="mt-2.5 space-y-1.5">
                        {m.suggestedActions.map((act, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(act)}
                            className="w-full text-left p-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 text-[11px] font-medium flex items-center justify-between transition-colors"
                          >
                            <span>{act}</span>
                            <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                          </button>
                        ))}
                      </div>
                    )}

                    <span className="text-[9px] text-gray-500 mt-1 block px-1">{m.timestamp}</span>
                  </div>

                  {m.sender === "user" && (
                    <div className="w-7 h-7 rounded-lg bg-purple-600/30 border border-purple-500/40 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4 text-purple-300" />
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 w-fit">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Analyzing financial parameters...
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
                placeholder="Ask advice on savings, FD or budgets..."
                className="flex-1 bg-gray-900 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !inputMsg.trim()}
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
