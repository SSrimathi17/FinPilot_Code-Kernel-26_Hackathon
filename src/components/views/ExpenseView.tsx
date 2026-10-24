import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { TrendingDown, Plus, Search, Filter, Trash2, Mic, Upload, FileText, CheckCircle2, X, Sparkles } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";
import { ExpenseItem } from "../../types";
import { parseReceiptOCR } from "../../services/aiService";

export const ExpenseView: React.FC = () => {
  const { expenses, addExpense, deleteExpense, totalExpense } = useFinance();
  const { user } = useAuth();
  const { showToast, setVoiceModalOpen } = useUI();

  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");

  // Form State
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<ExpenseItem["category"]>("Food & Dining");
  const [paymentMethod, setPaymentMethod] = useState<ExpenseItem["paymentMethod"]>("UPI");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [ocrLoading, setOcrLoading] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || parseFloat(amount) <= 0) return;

    addExpense({
      title,
      amount: parseFloat(amount),
      category,
      paymentMethod,
      date,
      isRecurring,
    });

    showToast(`Recorded expense ${user.currency}${amount} under ${category}`, "success");
    setModalOpen(false);
    setTitle("");
    setAmount("");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOcrLoading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];
      const parsed = await parseReceiptOCR(base64, file.type);
      setTitle(parsed.merchantName || "Receipt Scan");
      setAmount(parsed.amount ? parsed.amount.toString() : "45");
      if (parsed.category) {
        setCategory(parsed.category as ExpenseItem["category"]);
      }
      setOcrLoading(false);
      showToast("OCR extracted receipt parameters!", "info");
    };
    reader.readAsDataURL(file);
  };

  const filteredExpenses = expenses.filter((item) => {
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
            <TrendingDown className="w-5 h-5 text-rose-400" /> Expense Management
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Log expenses with voice input, receipt AI parsing, category tracking & recurring bills.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Mic className="w-4 h-4 text-purple-400" /> Voice Entry
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-500/20 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Expense
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
            placeholder="Search expense description..."
            className="w-full bg-gray-950 border border-gray-800 focus:border-rose-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-gray-500 shrink-0" />
          {["All", "Housing & Rent", "Food & Dining", "Utilities", "Transport", "Education", "Entertainment"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  categoryFilter === cat
                    ? "bg-rose-600 text-white shadow-sm shadow-rose-500/20"
                    : "bg-gray-800/60 text-gray-400 hover:text-white"
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Expenses History List */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white mb-4">Expense Records ({filteredExpenses.length})</h3>

        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-xs">
            No expense entries found matching criteria.
          </div>
        ) : (
          <div className="space-y-3">
            {filteredExpenses.map((exp) => (
              <div
                key={exp.id}
                className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-rose-500/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                      <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-semibold">
                        {exp.category}
                      </span>
                      <span>• {exp.paymentMethod}</span>
                      <span>• {exp.date}</span>
                      {exp.isRecurring && <span className="text-amber-400">• Recurring</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-800">
                  <span className="text-base font-extrabold text-rose-400">
                    -{user.currency}{exp.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => {
                      deleteExpense(exp.id);
                      showToast("Expense entry deleted", "info");
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Add Expense with Receipt OCR */}
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
                <TrendingDown className="w-5 h-5 text-rose-400" /> Record Expense
              </h3>

              {/* Receipt Upload AI Box */}
              <div className="mb-4 p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-center">
                <p className="text-xs font-semibold text-purple-300 flex items-center justify-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" /> AI Receipt Auto-Scan
                </p>
                <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow transition-all">
                  <Upload className="w-3.5 h-3.5" />
                  {ocrLoading ? "Scanning Receipt..." : "Upload Receipt Photo"}
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Title / Vendor</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Grocery Store, Electric Bill"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
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
                      placeholder="e.g. 120"
                      className="w-full bg-gray-950 border border-gray-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ExpenseItem["category"])}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Food & Dining">Food & Dining</option>
                      <option value="Housing & Rent">Housing & Rent</option>
                      <option value="Utilities">Utilities</option>
                      <option value="Transport">Transport</option>
                      <option value="Education">Education</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value as ExpenseItem["paymentMethod"])}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-rose-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                    >
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="NetBanking">NetBanking</option>
                      <option value="Cash">Cash</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1">Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 focus:border-rose-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="expRecurring"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded bg-gray-950 border-gray-800 text-rose-600 focus:ring-0"
                  />
                  <label htmlFor="expRecurring" className="text-xs text-gray-300">
                    Recurring Monthly Expense
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-500/25 transition-all mt-2"
                >
                  Save Expense Record
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
