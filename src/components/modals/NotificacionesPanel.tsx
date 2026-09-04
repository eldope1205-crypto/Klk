import React from "react";
import { useApp } from "../../context/AppContext";
import { X, CheckCheck, Bell, Sparkles, AlertTriangle, Info, Gift } from "lucide-react";

export const NotificacionesPanel: React.FC = () => {
  const {
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotification,
    setActiveView,
  } = useApp();

  if (!notificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-neutral-950 border-l border-neutral-900 h-full flex flex-col p-6 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="text-base font-extrabold text-white tracking-wide">Notificaciones</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
              title="Marcar todas como leídas"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Marcar leídas</span>
            </button>
            <button
              onClick={() => setNotificationsOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-2.5 pr-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 text-xs">
              No tienes notificaciones pendientes.
            </div>
          ) : (
            notifications.map((notif) => {
              const iconMap = {
                success: <Sparkles className="w-4 h-4 text-emerald-400" />,
                info: <Info className="w-4 h-4 text-blue-400" />,
                warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
                reward: <Gift className="w-4 h-4 text-amber-400" />,
              };

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationRead(notif.id);
                    if (notif.actionTool) {
                      setActiveView(notif.actionTool);
                      setNotificationsOpen(false);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    notif.read
                      ? "bg-neutral-900/40 border-neutral-850 opacity-70 hover:opacity-100"
                      : "bg-neutral-900 border-neutral-750 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded-xl bg-neutral-800 border border-neutral-700">
                      {iconMap[notif.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                        <span className="text-[10px] text-neutral-500 whitespace-nowrap ml-2">
                          {notif.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
