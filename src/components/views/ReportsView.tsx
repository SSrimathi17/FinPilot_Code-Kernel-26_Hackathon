import React from "react";
import { BarChart3, PieChart as PieIcon, Download, Sparkles, TrendingUp, TrendingDown, Wallet } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";

export const ReportsView: React.FC = () => {
  const { totalIncome, totalExpense, totalSavings, budgets } = useFinance();
  const { user } = useAuth();
  const { showToast } = useUI();

  const pieData = budgets.map((b) => ({
    name: b.category,
    value: b.spent,
  }));

  const COLORS = ["#2563EB", "#7C3AED", "#22C55E", "#F59E0B", "#EC4899", "#3B82F6", "#10B981"];

  const barData = [
    { month: "Jan", Income: 3200, Expense: 2100, Savings: 1100 },
    { month: "Feb", Income: 3500, Expense: 2300, Savings: 1200 },
    { month: "Mar", Income: 3800, Expense: 2200, Savings: 1600 },
    { month: "Apr", Income: 4000, Expense: 2400, Savings: 1600 },
    { month: "May", Income: 4200, Expense: 2500, Savings: 1700 },
    { month: "Jun", Income: 4500, Expense: 2600, Savings: 1900 },
    { month: "Jul", Income: totalIncome, Expense: totalExpense, Savings: totalIncome - totalExpense },
  ];

  const handleExport = (type: string) => {
    showToast(`Exported ${type} financial statement report!`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" /> Financial Analytics & PDF Reports
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Comprehensive cashflow statements, category expense distributions & export capabilities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport("PDF")}
            className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button
            onClick={() => handleExport("Excel")}
            className="px-4 py-2.5 rounded-2xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs border border-gray-700 transition-all"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
          <span className="text-xs text-gray-400 block font-medium">Average Monthly Inflow</span>
          <span className="text-2xl font-extrabold text-blue-400 mt-1 block">
            {user.currency}{totalIncome.toLocaleString()}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
          <span className="text-xs text-gray-400 block font-medium">Average Monthly Outflow</span>
          <span className="text-2xl font-extrabold text-rose-400 mt-1 block">
            {user.currency}{totalExpense.toLocaleString()}
          </span>
        </div>
        <div className="p-5 rounded-2xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
          <span className="text-xs text-gray-400 block font-medium">Savings Retention Ratio</span>
          <span className="text-2xl font-extrabold text-emerald-400 mt-1 block">
            {Math.round(((totalIncome - totalExpense) / totalIncome) * 100)}%
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Multi-Bar Chart */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
          <h3 className="text-sm font-bold text-white mb-4">6-Month Cashflow Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
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
                <Bar dataKey="Income" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Expense" fill="#EC4899" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Savings" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Distribution Pie */}
        <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-white mb-4">Category Outflow Proportions</h3>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
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
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
            {budgets.map((b, idx) => (
              <div key={b.category} className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-gray-300 truncate">{b.category}: {user.currency}{b.spent}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
