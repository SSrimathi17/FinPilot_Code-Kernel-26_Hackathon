import React, { useState } from "react";
import { motion } from "motion/react";
import { Wallet, Mail, Lock, User, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { UserProfile } from "../../types";

export const AuthPage: React.FC = () => {
  const { setAuthState, login, switchProfileRole } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("alex.morgan@finsmart.app");
  const [password, setPassword] = useState("••••••••");
  const [name, setName] = useState("Alex Morgan");
  const [occupation, setOccupation] = useState<UserProfile["occupation"]>("Young Professional");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    switchProfileRole(occupation);
    login(email, mode === "register" ? name : email.split("@")[0]);
  };

  const handleGoogleAuth = () => {
    login("user.google@finsmart.app", "Google User");
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Radial background blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-md w-full z-10">
        {/* Back Button */}
        <button
          onClick={() => setAuthState("welcome")}
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Welcome
        </button>

        {/* Card Frame */}
        <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 p-0.5 shadow-lg shadow-blue-500/30">
              <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
                <Wallet className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">FinSmart AI</h2>
              <p className="text-xs text-gray-400">Secure Access Portal</p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-gray-800/60 p-1 rounded-2xl mb-6 border border-gray-700/50">
            <button
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === "login"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`py-2 text-xs font-semibold rounded-xl transition-all ${
                mode === "register"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                />
              </div>
            </div>

            {mode === "register" && (
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Target Profile Persona</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value as UserProfile["occupation"])}
                  className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none transition-colors"
                >
                  <option value="Student">Student</option>
                  <option value="Fresher">Fresher / Intern</option>
                  <option value="First-Time Earner">First-Time Earner</option>
                  <option value="Young Professional">Young Professional</option>
                  <option value="Family">Family Head</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {mode === "login" ? "Sign In to FinSmart" : "Create My Account"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-800" />
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Or continue with</span>
            <div className="flex-1 h-px bg-gray-800" />
          </div>

          {/* Social Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            className="w-full py-2.5 rounded-xl border border-gray-700 bg-gray-800/50 hover:bg-gray-800 text-xs font-semibold text-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.26v3.15C3.25 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.61H1.26C.46 8.2.01 10.03.01 12c0 1.97.45 3.8 1.25 5.39l4.02-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.61l4.02 3.15c.95-2.85 3.6-4.96 6.72-4.96z"
              />
            </svg>
            Sign in with Google OAuth
          </button>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit Encrypted • Privacy Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
};
