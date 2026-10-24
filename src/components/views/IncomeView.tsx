import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingUp, Plus, Search, Filter, Trash2, Calendar, DollarSign, Wallet, CheckCircle2, X } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { IncomeItem } from "../../types";

export const IncomeView: React.FC = () => {
  const { incomes, addIncome, deleteIncome, totalIncome } = useFinance();
  const { user } = useAuth();
  const { showToast } = useUI();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<IncomeItem["category"]>("Salary");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(true);
  const [notes, setNotes] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;

    addIncome({
      title,
      amount: parseFloat(amount),
      category,
      date,
      isRecurring,
      notes,
    });

    showToast(`Added ${category} income of ${user.currency}${amount}`, "success");
    setModalOpen(false);
    setTitle("");
    setAmount("");
    setNotes("");
  };

  const filteredIncomes = incomes.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" /> Income Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Track salaries, freelance retainers, dividends, allowances and cash inflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-right">
            <span className="text-[10px] text-gray-400 block font-semibold uppercase">Total Monthly Cash Inflow</span>
            <span className="text-lg font-black text-blue-400">
              {user.currency}{totalIncome.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Income Source
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-gray-900/60 border border-gray-800 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search income title..."
            className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {["All", "Salary", "Freelancing", "Business", "Investments", "Allowance"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-500/20"
                  : "bg-gray-800/60 text-gray-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Income Records List Table */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white mb-4">Income History ({filteredIncomes.length})</h3>

        {filteredIncomes.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            No income entries found matching criteria. Click "Add Income Source" to record one.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredIncomes.map((inc) => (
              <div
                key={inc.id}
                className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Wallet className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{inc.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-semibold">
                        {inc.category}
                      </span>
                      <span>• {inc.date}</span>
                      {inc.isRecurring && <span className="text-emerald-400">• Recurring</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-800">
                  <span className="text-base font-extrabold text-blue-400">
                    +{user.currency}{inc.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      deleteIncome(inc.id);
                      showToast("Income entry deleted", "info");
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Income Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>

              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" /> Record New Income
              </h3>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Income Source Title</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Monthly Salary, Freelance Design"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Amount ({user.currency})</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="e.g. 2500"
                      className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as IncomeItem["category"])}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Salary">Salary</option>
                      <option value="Freelancing">Freelancing</option>
                      <option value="Business">Business</option>
                      <option value="Investments">Investments</option>
                      <option value="Allowance">Allowance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded bg-gray-950 border-gray-800 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="recurring" className="text-xs text-gray-300">
                    Recurring Monthly Inflow
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all mt-2"
                >
                  Save Income Entry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
