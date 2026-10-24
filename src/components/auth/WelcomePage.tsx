import React from "react";
import { motion } from "motion/react";
import {
  Wallet,
  Bot,
  GraduationCap,
  MapPin,
  FolderLock,
  ArrowRight,
  CheckCircle2,
  Users,
  Briefcase,
  Sparkles,
  Award,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserProfile } from "../../types";

export const WelcomePage: React.FC = () => {
  const { setAuthState, switchProfileRole, user, login } = useAuth();

  const personas: { role: UserProfile["occupation"]; label: string; desc: string; icon: any; color: string }[] = [
    {
      role: "Student",
      label: "Students",
      desc: "Manage pocket allowance, campus budgets & student savings.",
      icon: GraduationCap,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-400",
    },
    {
      role: "Fresher",
      label: "Freshers & Interns",
      desc: "First paycheck guidance, 50/30/20 rule & basic taxes.",
      icon: Sparkles,
      color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-400",
    },
    {
      role: "First-Time Earner",
      label: "First-Time Earners",
      desc: "Emergency fund setup, non-speculative FD & gold savings.",
      icon: Wallet,
      color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30 text-emerald-400",
    },
    {
      role: "Young Professional",
      label: "Young Professionals",
      desc: "Automated wealth goals, career certifications & budget limits.",
      icon: Briefcase,
      color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-400",
    },
    {
      role: "Family",
      label: "Families",
      desc: "Household budget tracking, education funds & document vault.",
      icon: Users,
      color: "from-pink-500/20 to-rose-500/10 border-pink-500/30 text-pink-400",
    },
  ];

  const handleSelectRole = (role: UserProfile["occupation"]) => {
    switchProfileRole(role);
  };

  const handleQuickDemo = () => {
    login("demo.user@finsmart.app", "Alex Morgan");
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Brand Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <span className="text-xl font-bold tracking-tight">
            FinSmart <span className="text-blue-400">AI</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setAuthState("auth")}
            className="px-4 py-2 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-sm font-medium transition-all"
          >
            Sign In
          </button>
          <button
            onClick={handleQuickDemo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            Quick Demo <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto w-full my-auto py-8 z-10">
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-6"
          >
            <Award className="w-4 h-4 text-emerald-400" />
            Educational & Non-Speculative Financial Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight"
          >
            Master Your Money with{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
              AI-Powered Literacy
            </span>{" "}
            & Precision Management
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-base sm:text-lg text-gray-300 font-normal leading-relaxed"
          >
            Track income, set smart budgets, safeguard documents, locate nearby verified financial services, and learn long-term financial principles safely.
          </motion.p>
        </div>

        {/* Persona Selector Section */}
        <div className="mt-10">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
            Select Your Persona for Customized Dashboard Insights
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {personas.map((p, idx) => {
              const Icon = p.icon;
              const isSelected = user.occupation === p.role;
              return (
                <motion.div
                  key={p.role}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.08 }}
                  onClick={() => handleSelectRole(p.role)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                    isSelected
                      ? "bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20"
                      : "bg-gray-900/60 border-gray-800 hover:border-gray-700 hover:bg-gray-800/80"
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br ${p.color} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-white flex items-center justify-between">
                    {p.label}
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1.5 leading-snug">{p.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Major Feature Highlights Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">AI Financial Advisor</h4>
              <p className="text-xs text-gray-400 mt-0.5">Instant budget advice & non-speculative literacy assistance.</p>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Education Hub</h4>
              <p className="text-xs text-gray-400 mt-0.5">Interactive courses, quizzes, FD & gold guides with certificates.</p>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Verified Resource Locator</h4>
              <p className="text-xs text-gray-400 mt-0.5">Locate nearby banks, lawyers, surveyors & govt registration offices.</p>
            </div>
          </div>

          <div className="bg-gray-900/40 border border-gray-800 rounded-2xl p-4 flex items-start gap-3 backdrop-blur-sm">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Document Vault & OCR</h4>
              <p className="text-xs text-gray-400 mt-0.5">Store tax forms, identity cards & receipts with AI extraction.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-10 text-center">
          <button
            onClick={handleQuickDemo}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-base shadow-xl shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-3 mx-auto"
          >
            Launch FinSmart Workspace
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer minimal info */}
      <div className="max-w-7xl mx-auto w-full text-center py-4 text-xs text-gray-500 border-t border-gray-800/50 z-10">
        FinSmart AI Educational Platform • Strictly Non-Speculative • No Stock Predictions • Built for Literacy & Discipline
      </div>
    </div>
  );
};
