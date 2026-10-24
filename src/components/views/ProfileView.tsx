import React, { useState } from "react";
import { User, Award, ShieldCheck, Save, Mail, Briefcase, DollarSign } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFinance } from "../../context/FinanceContext";
import { useUI } from "../../context/UIContext";

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { healthScore } = useFinance();
  const { showToast } = useUI();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [occupation, setOccupation] = useState(user.occupation);
  const [currency, setCurrency] = useState(user.currency);
  const [monthlyIncomeTarget, setMonthlyIncomeTarget] = useState(user.monthlyIncomeTarget.toString());

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      occupation: occupation as any,
      currency,
      monthlyIncomeTarget: parseFloat(monthlyIncomeTarget) || 3500,
    });
    showToast("Profile details updated successfully!", "success");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white text-xl font-extrabold shadow-lg shadow-blue-500/20 shrink-0">
          {user.name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-white">{user.name}</h2>
          <span className="text-xs text-blue-400 font-semibold">{user.occupation}</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Financial Health: {healthScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
        <h3 className="text-sm font-bold text-white mb-4">Edit Persona & Preferences</h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Occupation Persona</label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value as any)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Student">Student</option>
                <option value="Fresher">Fresher</option>
                <option value="First-Time Earner">First-Time Earner</option>
                <option value="Young Professional">Young Professional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Currency Symbol</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="$">$ (USD)</option>
                <option value="₹">₹ (INR)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Monthly Income Target ({currency})</label>
            <input
              type="number"
              value={monthlyIncomeTarget}
              onChange={(e) => setMonthlyIncomeTarget(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 focus:border-blue-500 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>
        </form>
      </div>
    </div>
  );
};
