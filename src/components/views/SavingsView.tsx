import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Target, Plus, ShieldCheck, CheckCircle2, Calendar, Award, DollarSign, X } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { SavingsGoal } from "../../types";

export const SavingsView: React.FC = () => {
  const { savingsGoals, addSavingsGoal, depositToGoal, toggleMilestone, totalSavings } = useFinance();
  const { user } = useAuth();
  const { showToast } = useUI();

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [depositModalOpen, setDepositModalOpen] = useState<string | null>(null);

  // New Goal Form
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [category, setCategory] = useState<SavingsGoal["category"]>("Emergency Fund");
  const [targetDate, setTargetDate] = useState("2026-12-31");

  // Deposit Form
  const [depositAmount, setDepositAmount] = useState("");

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetAmount) return;

    addSavingsGoal({
      title,
      targetAmount: parseFloat(targetAmount),
      category,
      targetDate,
    });

    showToast(`Created savings goal "${title}"!`, "success");
    setCreateModalOpen(false);
    setTitle("");
    setTargetAmount("");
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalOpen || !depositAmount) return;

    depositToGoal(depositModalOpen, parseFloat(depositAmount));
    showToast(`Deposited ${user.currency}${depositAmount} to goal!`, "success");
    setDepositModalOpen(null);
    setDepositAmount("");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" /> Savings Goals & Milestones
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Build financial safety nets, vehicle deposits, education reserves & vacation funds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-right">
            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Saved Accumulation</span>
            <span className="text-lg font-black text-emerald-400">
              {user.currency}{totalSavings.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Savings Target
          </button>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savingsGoals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));

          return (
            <div
              key={goal.id}
              className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase">
                      {goal.category}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{goal.title}</h3>
                  </div>

                  <button
                    onClick={() => setDepositModalOpen(goal.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-all shrink-0"
                  >
                    + Deposit Funds
                  </button>
                </div>

                <div className="my-4">
                  <div className="flex justify-between text-xs mb-1.5 font-semibold">
                    <span className="text-gray-300">
                      Saved: {user.currency}{goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="text-emerald-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-3 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 mt-1">
                    <span>Target: {user.currency}{goal.targetAmount.toLocaleString()}</span>
                    <span>Deadline: {goal.targetDate}</span>
                  </div>
                </div>

                {/* Milestones Checkbox List */}
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-800">
                  <p className="text-xs font-bold text-gray-300">Target Milestones:</p>
                  {goal.milestones.map((m, idx) => (
                    <div
                      key={idx}
                      onClick={() => toggleMilestone(goal.id, idx)}
                      className="flex items-center gap-2 cursor-pointer text-xs text-gray-300 hover:text-white"
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${m.completed ? "bg-emerald-600 border-emerald-500 text-white" : "border-gray-700 bg-gray-950"}`}>
                        {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                      <span className={m.completed ? "line-through text-gray-500" : ""}>{m.title} ({user.currency}{m.amount})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      <AnimatePresence>
        {depositModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button onClick={() => setDepositModalOpen(null)} className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold text-white mb-4">Deposit to Goal</h3>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Deposit Amount ({user.currency})</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    placeholder="e.g. 100"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all">
                  Confirm Deposit
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Goal Modal */}
      <AnimatePresence>
        {createModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button onClick={() => setCreateModalOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800">
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-bold text-white mb-4">Create New Savings Target</h3>
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Higher Education Fund"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Target Amount ({user.currency})</label>
                    <input
                      type="number"
                      required
                      min="100"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as SavingsGoal["category"])}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Emergency Fund">Emergency Fund</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Education">Education</option>
                      <option value="Vacation">Vacation</option>
                      <option value="House">House</option>
                      <option value="Tech Gadget">Tech Gadget</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Target Date</label>
                  <input
                    type="date"
                    required
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-emerald-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <button type="submit" className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all">
                  Create Goal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
