import React from "react";
import { GreyLogo } from "../common/GreyLogo";
import { useApp } from "../../context/AppContext";
import { ToolId } from "../../types";
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  FileText,
  Image,
  Video,
  Music,
  Film,
  Layers,
  Sliders,
  FolderKanban,
  Library,
  Flame,
  Clock,
  BarChart3,
  Zap,
  Cpu,
  Settings,
  ShieldAlert,
  LogOut,
  X,
  PlusCircle,
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    sidebarOpen,
    setSidebarOpen,
    user,
    points,
    setIsLoggedIn,
    setCreateModalOpen,
  } = useApp();

  const navItems: {
    id: ToolId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
    category?: string;
  }[] = [
    { id: "dashboard", label: "Inicio / Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    {
      id: "director",
      label: "Director IA",
      icon: <Sparkles className="w-4 h-4 text-white" />,
      badge: "Cerebro",
    },
    { id: "chat", label: "Chat IA", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "contenido", label: "Generador de Contenido", icon: <FileText className="w-4 h-4" /> },
    { id: "imagen", label: "Imagen IA", icon: <Image className="w-4 h-4" /> },
    { id: "video", label: "Vídeo IA", icon: <Video className="w-4 h-4" /> },
    { id: "audio", label: "Audio IA", icon: <Music className="w-4 h-4" /> },
    { id: "estudio_video", label: "Estudio de Vídeo IA", icon: <Film className="w-4 h-4" /> },
    { id: "estudio_visual", label: "Estudio Visual IA", icon: <Layers className="w-4 h-4" /> },
    { id: "laboratorio_audio", label: "Laboratorio de Audio", icon: <Sliders className="w-4 h-4" /> },
    { id: "editor", label: "Editor IA", icon: <Sliders className="w-4 h-4" /> },
    { id: "plantillas", label: "Plantillas", icon: <Flame className="w-4 h-4" /> },
    { id: "proyectos", label: "Proyectos", icon: <FolderKanban className="w-4 h-4" /> },
    { id: "biblioteca", label: "Biblioteca", icon: <Library className="w-4 h-4" /> },
    { id: "historial", label: "Historial", icon: <Clock className="w-4 h-4" /> },
    { id: "estadisticas", label: "Estadísticas", icon: <BarChart3 className="w-4 h-4" /> },
    { id: "puntos", label: "⚡ Puntos & Planes", icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: "api", label: "API / AI Hub", icon: <Cpu className="w-4 h-4" /> },
    { id: "ajustes", label: "Ajustes", icon: <Settings className="w-4 h-4" /> },
    { id: "admin", label: "Panel Admin", icon: <ShieldAlert className="w-4 h-4 text-neutral-400" /> },
  ];

  const handleSelect = (id: ToolId) => {
    setActiveView(id);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-72 bg-neutral-950 border-r border-neutral-900 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0 lg:static"
        }`}
      >
        {/* Top Header */}
        <div>
          <div className="p-4 border-b border-neutral-900 flex items-center justify-between">
            <div
              onClick={() => handleSelect("dashboard")}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <GreyLogo size="sm" glow={true} />
              <span className="font-extrabold tracking-[0.22em] text-white text-base">GREY IA</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Info Card */}
          <div className="p-4 border-b border-neutral-900/80 bg-neutral-900/30">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-neutral-700"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-white truncate">{user.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-semibold tracking-wider">
                    {user.plan}
                  </span>
                </div>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-neutral-400">
                  <span className="text-amber-400 font-bold">⚡ {points.toLocaleString()}</span> pts
                </div>
              </div>
            </div>

            {/* Quick Action: New Creation */}
            <button
              id="sidebar-quick-create-btn"
              onClick={() => {
                setCreateModalOpen(true);
                setSidebarOpen(false);
              }}
              className="w-full mt-3 py-2 px-3 rounded-xl bg-white text-black text-xs font-bold flex items-center justify-center gap-2 hover:bg-neutral-200 transition-colors shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Nueva creación
            </button>
          </div>

          {/* Scrollable Navigation List */}
          <nav className="p-2 space-y-1 overflow-y-auto max-h-[calc(100vh-280px)] scrollbar-thin scrollbar-thumb-neutral-800">
            {navItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-white text-black font-bold shadow-sm"
                      : "text-neutral-400 hover:text-white hover:bg-neutral-900/80"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isActive ? "text-black" : "text-neutral-400"}>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        isActive ? "bg-black text-white" : "bg-neutral-800 text-neutral-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: Sign Out */}
        <div className="p-3 border-t border-neutral-900">
          <button
            id="sidebar-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
