import React from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  TrendingUp,
  TrendingDown,
  PieChart,
  Target,
  Landmark,
  Bot,
  GraduationCap,
  MapPin,
  FolderLock,
  BarChart3,
  Bell,
  Mic,
  User,
  Settings,
  ChevronLeft,
  Wallet,
  X,
} from "lucide-react";
import { useUI } from "../../context/UIContext";
import { useFinance } from "../../context/FinanceContext";
import { NavigationTab } from "../../types";

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: any;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, toggleSidebar, setSidebarOpen } = useUI();
  const { notifications, savingsGoals } = useFinance();

  const unreadCount = (notifications || []).filter((n) => !n.read).length;
  const activeGoalsCount = (savingsGoals || []).filter((g) => !g.isCompleted).length;

  const navItems: NavItem[] = [
    { id: "home", label: "Dashboard", icon: Home },
    { id: "income", label: "Income", icon: TrendingUp },
    { id: "expense", label: "Expenses", icon: TrendingDown },
    { id: "budget", label: "Budget Planner", icon: PieChart },
    { id: "savings", label: "Savings Goals", icon: Target, badge: activeGoalsCount },
    { id: "investment", label: "Investment Center", icon: Landmark },
    { id: "ai_assistant", label: "AI Assistant", icon: Bot },
    { id: "education", label: "Education Hub", icon: GraduationCap },
    { id: "resource_locator", label: "Resource Locator", icon: MapPin },
    { id: "document_vault", label: "Document Vault", icon: FolderLock },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "voice_assistant", label: "Voice Assistant", icon: Mic },
    { id: "profile", label: "Profile", icon: User },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Persistent Left Sidebar */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 bg-[#0F172A]/90 border-r border-gray-800/80 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-20"
        } ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-800/60">
          <div
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-emerald-500 p-0.5 shadow-md shadow-blue-500/20 shrink-0">
              <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="whitespace-nowrap"
              >
                <h1 className="text-base font-bold text-white tracking-tight">FinSmart</h1>
                <p className="text-[10px] text-blue-400 font-medium">AI Financial Core</p>
              </motion.div>
            )}
          </div>

          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex p-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
            title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!sidebarOpen && "rotate-180"}`} />
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="flex lg:hidden p-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-white" : "text-gray-400 group-hover:text-blue-400"
                  }`}
                />

                {sidebarOpen && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {/* Badge indicator */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      isActive
                        ? "bg-white text-blue-600"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    } ${!sidebarOpen && "absolute top-1 right-1 px-1.5 py-0 text-[8px]"}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Indicator */}
        {sidebarOpen && (
          <div className="p-3 m-3 rounded-xl bg-gradient-to-b from-blue-950/40 to-purple-950/40 border border-blue-500/20 text-center">
            <p className="text-[11px] font-semibold text-blue-300">Non-Speculative Advisor</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Educational Mode Enabled</p>
          </div>
        )}
      </aside>
    </>
  );
};
