import React from "react";
import { useApp } from "../../context/AppContext";
import { LayoutDashboard, FolderKanban, Plus, Clock, Settings } from "lucide-react";

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, setCreateModalOpen } = useApp();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-850 px-3 py-2 flex items-center justify-around shadow-2xl">
      {/* Inicio */}
      <button
        id="mobile-nav-inicio"
        onClick={() => setActiveView("dashboard")}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeView === "dashboard" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wide">Inicio</span>
      </button>

      {/* Proyectos */}
      <button
        id="mobile-nav-proyectos"
        onClick={() => setActiveView("proyectos")}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeView === "proyectos" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <FolderKanban className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wide">Proyectos</span>
      </button>

      {/* Center Action Button: + (Opens creation options) */}
      <div className="relative -top-3">
        <button
          id="mobile-nav-create-center-btn"
          onClick={() => setCreateModalOpen(true)}
          aria-label="Crear nuevo proyecto o recurso"
          className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:bg-neutral-200 active:scale-95 transition-all"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* Historial */}
      <button
        id="mobile-nav-historial"
        onClick={() => setActiveView("historial")}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeView === "historial" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <Clock className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wide">Historial</span>
      </button>

      {/* Ajustes */}
      <button
        id="mobile-nav-ajustes"
        onClick={() => setActiveView("ajustes")}
        className={`flex flex-col items-center gap-1 p-1.5 transition-colors ${
          activeView === "ajustes" ? "text-white" : "text-neutral-500 hover:text-neutral-300"
        }`}
      >
        <Settings className="w-5 h-5" />
        <span className="text-[10px] font-semibold tracking-wide">Ajustes</span>
      </button>
    </div>
  );
};
