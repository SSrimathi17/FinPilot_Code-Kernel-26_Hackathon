import React, { useState } from "react";
import {
  Search,
  Bell,
  Mic,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Sparkles,
  ShieldCheck,
  Moon,
  Sun,
  Check,
} from "lucide-react";
import { useUI } from "../../context/UIContext";
import { useAuth } from "../../context/AuthContext";
import { useFinance } from "../../context/FinanceContext";
import { NavigationTab, UserProfile } from "../../types";

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    setVoiceModalOpen,
    setAiModalOpen,
  } = useUI();

  const { user, logout, switchProfileRole, updateProfile } = useAuth();
  const { notifications, markNotificationRead } = useFinance();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadNotifications = (notifications || []).filter((n) => !n.read);

  const breadcrumbsMap: Record<NavigationTab, { title: string; subtitle: string }> = {
    home: { title: "Financial Overview", subtitle: "Real-time metrics & AI summary" },
    income: { title: "Income Management", subtitle: "Track salaries, freelance & business cash inflow" },
    expense: { title: "Expense Management", subtitle: "Monitor spending, receipt scans & voice entry" },
    budget: { title: "Budget Planner", subtitle: "50/30/20 budget allocations & category thresholds" },
    savings: { title: "Savings Goals", subtitle: "Milestones, emergency funds & target countdowns" },
    investment: { title: "Investment Center", subtitle: "Educational guide on FDs, Sovereign Gold & Bonds" },
    ai_assistant: { title: "AI Financial Assistant", subtitle: "Personalized advice & financial Q&A" },
    education: { title: "Financial Literacy Hub", subtitle: "Interactive courses, quizzes & certificates" },
    resource_locator: { title: "Verified Resource Locator", subtitle: "Nearby banks, surveyors, lawyers & govt offices" },
    document_vault: { title: "Financial Document Vault", subtitle: "Encrypted document storage & OCR extraction" },
    reports: { title: "Analytics & Export Reports", subtitle: "Cash flow trends & downloadable statements" },
    notifications: { title: "Notification Center", subtitle: "Bill alerts & budget warnings" },
    voice_assistant: { title: "Voice Financial Assistant", subtitle: "Hands-free voice expense logging & commands" },
    profile: { title: "User Profile", subtitle: "Personal credentials & persona settings" },
    settings: { title: "App Settings", subtitle: "Preferences, currency & privacy controls" },
  };

  const breadcrumb = breadcrumbsMap[activeTab] || { title: "Dashboard", subtitle: "Overview" };

  const roles: UserProfile["occupation"][] = [
    "Student",
    "Fresher",
    "First-Time Earner",
    "Young Professional",
    "Family",
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0B1220]/80 border-b border-gray-800/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-gray-800/60 hover:bg-gray-800 text-gray-300 hover:text-white transition-colors lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span
              onClick={() => setActiveTab("home")}
              className="hover:text-blue-400 cursor-pointer transition-colors font-medium"
            >
              FinSmart
            </span>
            <span>/</span>
            <span className="text-blue-400 font-semibold capitalize">{activeTab.replace("_", " ")}</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
            {breadcrumb.title}
            <span className="hidden md:inline-block px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-semibold border border-blue-500/20">
              {user.occupation}
            </span>
          </h2>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-xs relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search transactions, courses..."
          className="w-full bg-gray-900/80 border border-gray-800 focus:border-blue-500 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none transition-all"
        />
      </div>

      {/* Right Actions: Voice, AI Launch, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Voice Trigger */}
        <button
          onClick={() => setVoiceModalOpen(true)}
          className="p-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 transition-colors relative group"
          title="Voice Assistant"
        >
          <Mic className="w-4 h-4" />
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-[10px] text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
            Voice Assistant
          </span>
        </button>

        {/* AI Chat Drawer Launch */}
        <button
          onClick={() => setAiModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="p-2 rounded-xl bg-gray-900/80 border border-gray-800 hover:bg-gray-800 text-gray-300 transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center animate-pulse">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {notifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-2">
                <span className="text-xs font-bold text-white">Notifications</span>
                <button
                  onClick={() => setActiveTab("notifications")}
                  className="text-[11px] text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {notifications.slice(0, 4).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.actionUrl) setActiveTab(n.actionUrl);
                      setNotifDropdownOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer border transition-all ${
                      n.read
                        ? "bg-gray-950/40 border-gray-800 text-gray-400"
                        : "bg-blue-500/10 border-blue-500/30 text-gray-200"
                    }`}
                  >
                    <p className="font-semibold text-white">{n.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{n.message}</p>
                    <span className="text-[9px] text-gray-500 mt-1 block">{n.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl bg-gray-900/80 border border-gray-800 hover:bg-gray-800 text-white transition-colors"
          >
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-blue-500/50"
            />
            <span className="hidden xl:inline-block text-xs font-semibold text-left">
              <span className="block truncate max-w-[100px]">{user.name}</span>
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl p-3 z-50">
              <div className="flex items-center gap-3 p-2 border-b border-gray-800 mb-2">
                <img src={user.avatarUrl} className="w-10 h-10 rounded-xl object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-white">{user.name}</h4>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Score: {user.financialHealthScore}/100
                  </span>
                </div>
              </div>

              {/* Persona Switcher Quick Section */}
              <div className="mb-2">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 px-2">
                  Switch Persona
                </p>
                <div className="space-y-0.5">
                  {roles.map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        switchProfileRole(r);
                        setProfileDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        user.occupation === r
                          ? "bg-blue-600/20 text-blue-400 font-semibold"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {r}
                      {user.occupation === r && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-2 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab("profile");
                    setProfileDropdownOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-gray-300 hover:bg-gray-800 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-gray-400" /> My Profile
                </button>
                <button
                  onClick={logout}
                  className="w-full text-left px-2 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
