import React from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Target,
  PieChart as PieIcon,
  Sparkles,
  ArrowUpRight,
  Plus,
  Mic,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Award,
  ShieldCheck,
  Zap,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import { useFinance } from "../../context/FinanceContext";
import { useUI } from "../../context/UIContext";

export const HomeDashboardView: React.FC = () => {
  const { user } = useAuth();
  const {
    totalIncome,
    totalExpense,
    totalSavings,
    healthScore,
    expenses,
    incomes,
    budgets,
    savingsGoals,
    notifications,
  } = useFinance();

  const { setActiveTab, setAiModalOpen, setVoiceModalOpen } = useUI();

  // Pie chart data
  const pieData = budgets.map((b) => ({
    name: b.category,
    value: b.spent,
  }));

  const COLORS = ["#2563EB", "#7C3AED", "#22C55E", "#F59E0B", "#EC4899", "#3B82F6", "#10B981"];

  // Monthly trend mock data
  const trendData = [
    { month: "Jan", income: 3400, expense: 2100 },
    { month: "Feb", income: 3600, expense: 2300 },
    { month: "Mar", income: 3800, expense: 2200 },
    { month: "Apr", income: 4100, expense: 2400 },
    { month: "May", income: 4200, expense: 2500 },
    { month: "Jun", income: 4500, expense: 2600 },
    { month: "Jul", income: totalIncome, expense: totalExpense },
  ];

  const totalAllocatedBudget = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpentBudget = budgets.reduce((sum, b) => sum + b.spent, 0);
  const budgetPercent = totalAllocatedBudget > 0 ? Math.round((totalSpentBudget / totalAllocatedBudget) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-purple-950 border border-blue-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Persona Profile: {user.occupation}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
              Your financial health score is <strong className="text-emerald-400">{healthScore}/100</strong>. You are on pace to save {user.currency}{totalIncome - totalExpense} this month.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab("expense")}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Expense
            </button>
            <button
              onClick={() => setVoiceModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs transition-all flex items-center gap-2"
            >
              <Mic className="w-4 h-4" /> Voice Command
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Health Score Gauge */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Financial Health Score</span>
            <Award className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{healthScore}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              Excellent
            </span>
          </div>
          <div className="mt-3 w-full bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-blue-500 h-full rounded-full"
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </motion.div>

        {/* Monthly Income */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Monthly Inflow</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">
              {user.currency}{totalIncome.toLocaleString()}
            </span>
            <span className="text-xs text-gray-400 block mt-1">Target: {user.currency}{user.monthlyIncomeTarget}</span>
          </div>
        </motion.div>

        {/* Monthly Expense */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Monthly Expenses</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">
              {user.currency}{totalExpense.toLocaleString()}
            </span>
            <span className="text-xs text-rose-400 block mt-1">
              {Math.round((totalExpense / totalIncome) * 100)}% of income
            </span>
          </div>
        </motion.div>

        {/* Net Savings */}
        <motion.div
          whileHover={{ y: -2 }}
          className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-400">Monthly Net Surplus</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-extrabold text-white">
              {user.currency}{(totalIncome - totalExpense).toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 block mt-1">
              +{Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}% Savings Rate
            </span>
          </div>
        </motion.div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expense Bar Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Income vs Expense Trend</h3>
              <p className="text-xs text-gray-400">Monthly cash flow dynamics</p>
            </div>
            <button
              onClick={() => setActiveTab("reports")}
              className="text-xs text-blue-400 font-semibold hover:underline flex items-center gap-1"
            >
              Full Analytics <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="income" fill="#2563EB" radius={[6, 6, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#EC4899" radius={[6, 6, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Pie Chart */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-white">Expense Distribution</h3>
              <p className="text-xs text-gray-400">Category breakdown</p>
            </div>
            <PieIcon className="w-4 h-4 text-purple-400" />
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0F172A",
                    borderColor: "#1E293B",
                    borderRadius: "12px",
                    color: "#fff",
                    fontSize: "11px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] mt-2">
            {budgets.slice(0, 4).map((b, idx) => (
              <div key={b.category} className="flex items-center gap-1.5 truncate">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                />
                <span className="text-gray-300 truncate">{b.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Advice Box & Budget Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Smart Suggestion */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-blue-950/60 via-gray-900 to-indigo-950/60 border border-blue-500/30 backdrop-blur-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Financial Insight</h3>
              <p className="text-xs text-gray-400">Custom tailored for {user.occupation}</p>
            </div>
          </div>

          <p className="text-xs text-gray-200 leading-relaxed">
            "You have saved 32% of your salary this month. We recommend transferring $200 of excess liquidity into your <strong>Emergency Safety Net Goal</strong> or a <strong>Sovereign Gold Bond</strong> yielding 2.5% fixed interest."
          </p>

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setAiModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
            >
              Discuss with AI <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab("investment")}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition-all"
            >
              Learn Gold & FD Options
            </button>
          </div>
        </div>

        {/* Budget Progress Box */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white">Monthly Budget Usage</h3>
              <p className="text-xs text-gray-400">Allocated vs Spent</p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              {budgetPercent}% Used
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-300">Total Spent</span>
                <span className="text-white font-bold">
                  {user.currency}{totalSpentBudget} / {user.currency}{totalAllocatedBudget}
                </span>
              </div>
              <div className="w-full bg-gray-800 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetPercent > 90 ? "bg-rose-500" : budgetPercent > 75 ? "bg-amber-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${Math.min(100, budgetPercent)}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between text-xs pt-2 border-t border-gray-800/60 text-gray-400">
              <span>Remaining Allowance:</span>
              <span className="text-emerald-400 font-semibold">
                {user.currency}{Math.max(0, totalAllocatedBudget - totalSpentBudget)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Goals & Recent Transactions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Savings Goals */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" /> Active Savings Goals
            </h3>
            <button
              onClick={() => setActiveTab("savings")}
              className="text-xs text-blue-400 font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {savingsGoals.slice(0, 3).map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3.5 rounded-2xl bg-gray-950/60 border border-gray-800">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-white">{goal.title}</span>
                    <span className="text-emerald-400 font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-1.5">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400">
                    <span>
                      {user.currency}{goal.currentAmount} saved
                    </span>
                    <span>Target: {user.currency}{goal.targetAmount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            <button
              onClick={() => setActiveTab("expense")}
              className="text-xs text-blue-400 font-semibold hover:underline"
            >
              Manage Expenses
            </button>
          </div>

          <div className="space-y-2.5">
            {expenses.slice(0, 4).map((exp) => (
              <div
                key={exp.id}
                className="p-3 rounded-2xl bg-gray-950/50 border border-gray-800/80 flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-white">{exp.title}</h4>
                  <span className="text-[10px] text-gray-400">
                    {exp.category} • {exp.date}
                  </span>
                </div>
                <span className="text-xs font-bold text-rose-400">
                  -{user.currency}{exp.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
