import React from "react";
import { Bell, AlertTriangle, CheckCircle2, Info, Trash2, Calendar } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useUI } from "../../context/UIContext";

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, clearNotifications } = useFinance();
  const { showToast } = useUI();

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" /> Notifications & Smart Reminders
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Budget alerts, bill payment reminders & savings goal progress updates.
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => {
              clearNotifications();
              showToast("Cleared all notifications", "info");
            }}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-bold text-xs border border-gray-700 transition-all flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            <Bell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            No new notifications or alerts. You are completely caught up!
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 rounded-2xl border flex items-start justify-between gap-3 cursor-pointer transition-colors ${
                  n.read
                    ? "bg-gray-950/40 border-gray-800 text-gray-400"
                    : "bg-gray-950/90 border-blue-500/40 text-white shadow-md"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                      n.type === "alert"
                        ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        : n.type === "reminder"
                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    }`}
                  >
                    {n.type === "alert" && <AlertTriangle className="w-4 h-4" />}
                    {n.type === "reminder" && <Calendar className="w-4 h-4" />}
                    {n.type === "info" && <Info className="w-4 h-4" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold">{n.title}</h4>
                    <p className="text-xs text-gray-300 mt-0.5">{n.message}</p>
                    <span className="text-[10px] text-gray-500 mt-1 block">{n.date}</span>
                  </div>
                </div>

                {!n.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0 mt-2 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
