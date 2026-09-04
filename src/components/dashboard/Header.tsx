import React from "react";
import { GreyLogo } from "../common/GreyLogo";
import { useApp } from "../../context/AppContext";
import { Menu, Bell, Gift, Sparkles, ChevronRight } from "lucide-react";

export const Header: React.FC = () => {
  const {
    points,
    setPuntosModalOpen,
    notifications,
    setNotificationsOpen,
    sidebarOpen,
    setSidebarOpen,
    claimDailyBonus,
    dailyBonusClaimed,
    setActiveView,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-30 w-full bg-black/90 backdrop-blur-md border-b border-neutral-900 px-4 py-3 flex items-center justify-between">
      {/* Left: Hamburger Menu & GREY IA Logo */}
      <div className="flex items-center gap-3">
        <button
          id="header-menu-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Abrir menú de navegación"
          className="p-2 -ml-1 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          {/* Consistent small triangle + G emblem */}
          <GreyLogo size="sm" glow={false} />
          <span className="font-extrabold tracking-[0.2em] text-white text-base group-hover:text-neutral-200 transition-colors">
            GREY IA
          </span>
        </div>
      </div>

      {/* Right: Points, Notifications & Gift/Rewards */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Dynamic Points Button */}
        <button
          id="header-points-btn"
          onClick={() => setPuntosModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-white text-xs font-semibold tracking-wide transition-all shadow-sm active:scale-95"
          title="Administrar puntos y paquetes"
        >
          <span className="text-amber-400">⚡</span>
          <span>{points.toLocaleString()} pts</span>
        </button>

        {/* Notifications Icon with Unread Badge */}
        <button
          id="header-notifications-btn"
          onClick={() => setNotificationsOpen(true)}
          aria-label="Notificaciones"
          className="relative p-2 rounded-xl text-neutral-300 hover:text-white hover:bg-neutral-900 transition-colors"
          title="Notificaciones de producción"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-white ring-2 ring-black animate-pulse" />
          )}
        </button>

        {/* Gift / Points / Rewards Icon */}
        <button
          id="header-rewards-btn"
          onClick={() => {
            if (!dailyBonusClaimed) {
              claimDailyBonus();
            } else {
              setPuntosModalOpen(true);
            }
          }}
          aria-label="Recompensas y beneficios"
          className={`relative p-2 rounded-xl transition-all ${
            !dailyBonusClaimed
              ? "text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-800/60 animate-pulse"
              : "text-neutral-300 hover:text-white hover:bg-neutral-900"
          }`}
          title={!dailyBonusClaimed ? "¡Reclama tu bono diario de +50 pts!" : "Beneficios y puntos"}
        >
          <Gift className="w-5 h-5" />
          {!dailyBonusClaimed && (
            <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-amber-400 text-black text-[9px] font-black rounded-full leading-none">
              +50
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
