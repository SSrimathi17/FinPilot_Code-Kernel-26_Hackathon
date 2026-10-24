import React, { useState } from "react";
import { PieChart as PieIcon, AlertTriangle, ShieldCheck, CheckCircle2, Edit3, Save, X } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { ExpenseItem } from "../../types";

export const BudgetView: React.FC = () => {
  const { budgets, updateBudget, totalExpense } = useFinance();
  const { user } = useAuth();
  const { showToast } = useUI();

  const [editingCategory, setEditingCategory] = useState<ExpenseItem["category"] | null>(null);
  const [newAllocated, setNewAllocated] = useState("");

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const handleSaveBudget = (cat: ExpenseItem["category"]) => {
    const val = parseFloat(newAllocated);
    if (!isNaN(val) && val >= 0) {
      updateBudget(cat, val);
      showToast(`Updated budget limit for ${cat} to ${user.currency}${val}`, "success");
    }
    setEditingCategory(null);
    setNewAllocated("");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-purple-400" /> Budget Planner
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Maintain strict fiscal discipline across categories with customizable caps & alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-right">
            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Allocated Budget</span>
            <span className="text-lg font-black text-purple-400">
              {user.currency}{totalAllocated.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Educational 50/30/20 Rule Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> FinSmart Educational Principle: The 50/30/20 Rule
        </h3>
        <p className="text-xs text-gray-300 mt-1 leading-relaxed">
          Allocate <strong>50%</strong> of income to essential Needs (Rent, Utilities, Groceries), <strong>30%</strong> to Wants (Dining, Entertainment), and <strong>20%</strong> to Savings & Emergency reserves.
        </p>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgets.map((b) => {
          const pct = b.allocated > 0 ? Math.min(100, Math.round((b.spent / b.allocated) * 100)) : 0;
          const isOver = b.spent > b.allocated;
          const isNear = pct >= 80 && !isOver;

          return (
            <div
              key={b.category}
              className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white">{b.category}</h4>
                  {editingCategory === b.category ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleSaveBudget(b.category)}
                        className="p-1 rounded bg-emerald-600 text-white"
                      >
                        <Save className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="p-1 rounded bg-gray-800 text-gray-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingCategory(b.category);
                        setNewAllocated(b.allocated.toString());
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {editingCategory === b.category ? (
                  <div className="my-2">
                    <label className="text-[10px] text-gray-400 block mb-1">Set Allocated Limit ({user.currency})</label>
                    <input
                      type="number"
                      value={newAllocated}
                      onChange={(e) => setNewAllocated(e.target.value)}
                      className="w-full bg-gray-950 border border-blue-500 rounded-xl px-2.5 py-1 text-xs text-white"
                    />
                  </div>
                ) : (
                  <div className="flex items-baseline justify-between mt-1 mb-3">
                    <span className="text-xl font-extrabold text-white">
                      {user.currency}{b.spent}
                    </span>
                    <span className="text-xs text-gray-400">Cap: {user.currency}{b.allocated}</span>
                  </div>
                )}

                <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver ? "bg-rose-500" : isNear ? "bg-amber-500" : "bg-purple-500"
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-2 border-t border-gray-800/80">
                <span className="text-gray-400">{pct}% Used</span>
                {isOver ? (
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Exceeded by {user.currency}{b.spent - b.allocated}
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold">
                    {user.currency}{b.allocated - b.spent} Left
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
