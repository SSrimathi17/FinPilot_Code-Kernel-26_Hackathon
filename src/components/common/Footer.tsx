import React from "react";
import { Wallet, ShieldCheck, Heart, Sparkles } from "lucide-react";
import { useUI } from "../../context/UIContext";

export const Footer: React.FC = () => {
  const { setActiveTab } = useUI();

  return (
    <footer className="mt-auto bg-[#0B1220] border-t border-gray-800/80 px-6 py-6 text-xs text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white">FinSmart AI</span>
          <span>— Educational Financial Platform</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
          <button onClick={() => setActiveTab("education")} className="hover:text-blue-400">
            Education Hub
          </button>
          <button onClick={() => setActiveTab("investment")} className="hover:text-blue-400">
            Investment Basics
          </button>
          <button onClick={() => setActiveTab("resource_locator")} className="hover:text-blue-400">
            Resource Locator
          </button>
          <button onClick={() => setActiveTab("document_vault")} className="hover:text-blue-400">
            Document Vault
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Non-Speculative Advisory</span>
        </div>
      </div>
    </footer>
  );
};
