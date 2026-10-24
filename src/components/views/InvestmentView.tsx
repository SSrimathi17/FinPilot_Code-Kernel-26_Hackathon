import React, { useState } from "react";
import { Landmark, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle, BookOpen, ExternalLink, Info } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";

export const InvestmentView: React.FC = () => {
  const { investmentOptions } = useFinance();
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredOptions = selectedCategory === "All"
    ? investmentOptions
    : investmentOptions.filter((opt) => opt.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Disclaimer Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 backdrop-blur-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Investment Information Center</h2>
            <p className="text-xs text-gray-400">Strictly Non-Speculative • Educational Literacy Only</p>
          </div>
        </div>
        <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
          FinSmart is an educational resource. This platform does not predict stock prices or sell speculative asset products. We teach guaranteed, government-backed, and non-speculative wealth accumulation options such as Sovereign Gold Bonds, Fixed Deposits, Public Provident Schemes, and index mutual fund fundamentals.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["All", "Fixed Deposit", "Gold", "Government Schemes", "Mutual Fund Basics"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                : "bg-gray-900/80 text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Investment Options Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOptions.map((opt) => (
          <div
            key={opt.id}
            className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full uppercase">
                  {opt.category}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full border ${
                    opt.riskLevel === "Very Low" || opt.riskLevel === "Low"
                      ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                      : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                  }`}
                >
                  Risk: {opt.riskLevel}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{opt.name}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{opt.description}</p>

              <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-gray-950/60 border border-gray-800/80 text-xs mb-4">
                <div>
                  <span className="text-gray-400 text-[10px] block font-semibold uppercase">Expected Returns</span>
                  <span className="text-emerald-400 font-extrabold">{opt.expectedReturns}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-semibold uppercase">Lock-In Period</span>
                  <span className="text-white font-bold">{opt.lockInPeriod}</span>
                </div>
              </div>

              {/* Pros & Cons */}
              <div className="space-y-3 text-xs mb-4">
                <div>
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5 mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Key Advantages (Pros)
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-300 text-[11px] pl-1">
                    {opt.pros.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Considerations (Cons)
                  </h4>
                  <ul className="list-disc list-inside space-y-0.5 text-gray-300 text-[11px] pl-1">
                    {opt.cons.map((c, idx) => (
                      <li key={idx}>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400">
              <span>Suitable for: {opt.suitableFor}</span>
              {opt.taxBenefits && (
                <span className="text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded">
                  Tax Deductible
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
