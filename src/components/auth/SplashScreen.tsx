import React, { useEffect } from "react";
import { motion } from "motion/react";
import { ShieldCheck, Sparkles, TrendingUp, Wallet } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export const SplashScreen: React.FC = () => {
  const { setAuthState } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthState("welcome");
    }, 2000);
    return () => clearTimeout(timer);
  }, [setAuthState]);

  return (
    <div 
      onClick={() => setAuthState("welcome")}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0B1220] text-white overflow-hidden cursor-pointer"
    >
      {/* Background glowing gradients */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      
      {/* Floating particles background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Animated Icon Emblem */}
        <motion.div
          initial={{ rotate: -180, scale: 0.5 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 120 }}
          className="relative mb-6 flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-purple-600 to-emerald-500 p-0.5 shadow-2xl shadow-blue-500/30"
        >
          <div className="w-full h-full bg-[#0B1220] rounded-[15px] flex items-center justify-center relative">
            <Wallet className="w-10 h-10 text-blue-400" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </motion.div>
          </div>
        </motion.div>

        {/* Brand Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            FinSmart
          </span>{" "}
          <span className="text-white font-light">AI</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-3 text-sm sm:text-base text-gray-400 max-w-sm font-medium"
        >
          Intelligent Financial Literacy & Resource Management Platform
        </motion.p>

        {/* Feature badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-semibold"
        >
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Smart Tracking
          </span>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" /> Non-Speculative Education
          </span>
        </motion.div>

        {/* Loading Progress Bar */}
        <div className="mt-10 w-48 h-1.5 bg-gray-800 rounded-full overflow-hidden relative">
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "0%" }}
            transition={{ duration: 2.2, ease: "easeInOut" }}
            className="w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-400 rounded-full"
          />
        </div>

        <span className="mt-3 text-xs text-gray-500 font-mono tracking-wider">
          Initializing Secure AI Core...
        </span>
      </motion.div>
    </div>
  );
};
