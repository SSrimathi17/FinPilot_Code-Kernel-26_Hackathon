import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from "lucide-react";
import { useUI } from "../../context/UIContext";

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useUI();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold backdrop-blur-xl ${
              t.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200"
                : t.type === "warning"
                ? "bg-amber-950/90 border-amber-500/40 text-amber-200"
                : t.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-200"
                : "bg-blue-950/90 border-blue-500/40 text-blue-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {t.type === "warning" && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {t.type === "error" && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
              {t.type === "info" && <Info className="w-4 h-4 text-blue-400 shrink-0" />}
              <span>{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="p-1 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
