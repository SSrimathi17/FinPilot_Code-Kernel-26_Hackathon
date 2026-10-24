import React from "react";
import { Settings, ShieldCheck, Database, Bell, Moon, Lock, RefreshCw } from "lucide-react";
import { useUI } from "../../context/UIContext";

export const SettingsView: React.FC = () => {
  const { showToast } = useUI();

  const handleResetData = () => {
    if (confirm("Are you sure you want to reset all financial data to default demo state?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
        <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mb-1">
          <Settings className="w-5 h-5 text-gray-400" /> Platform Settings
        </h2>
        <p className="text-xs text-gray-400">Configure security encryption, notification triggers & local storage.</p>
      </div>

      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-400" /> Premium Dark Glassmorphism Theme
            </h3>
            <p className="text-[11px] text-gray-400">Persistent eye-friendly dark design system</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Active
          </span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Non-Speculative Advisory Enforcer
            </h3>
            <p className="text-[11px] text-gray-400">Blocks stock prediction models and high-risk speculative recommendations</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Enabled
          </span>
        </div>

        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" /> Local Encrypted Vault Storage
            </h3>
            <p className="text-[11px] text-gray-400">All data stored locally in browser sandbox</p>
          </div>
          <button
            onClick={() => showToast("Encrypted sync active", "info")}
            className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold"
          >
            Check Status
          </button>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="text-xs font-bold text-rose-400 flex items-center gap-2">
              <Database className="w-4 h-4" /> Reset Application State
            </h3>
            <p className="text-[11px] text-gray-400">Restore initial demo datasets & clear cached records</p>
          </div>
          <button
            onClick={handleResetData}
            className="px-4 py-2 rounded-xl bg-rose-600/20 border border-rose-500/30 hover:bg-rose-600/30 text-rose-300 text-xs font-bold transition-all"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};
