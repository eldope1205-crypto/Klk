import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ToolId, Project } from "../../types";
import {
  MessageSquare,
  Sparkles,
  Image,
  Video,
  Music,
  Sliders,
  Flame,
  Grid,
  ArrowRight,
  Play,
  MoreVertical,
  Edit2,
  Copy,
  Trash2,
  Clock,
  TrendingUp,
  FolderKanban,
  CheckCircle,
  Target,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    user,
    setActiveView,
    projects,
    activeProject,
    setActiveProject,
    duplicateProject,
    deleteProject,
    updateProject,
    quickStats,
    setCreateModalOpen,
  } = useApp();

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editedName, setEditedName] = useState("");

  // Primary Tool Cards
  const mainToolCards: {
    id: ToolId;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    featured?: boolean;
    badge?: string;
  }[] = [
    {
      id: "chat",
      title: "CHAT IA",
      subtitle: "Conversaciones inteligentes",
      icon: <MessageSquare className="w-6 h-6 text-white" />,
    },
    {
      id: "director",
      title: "DIRECTOR IA",
      subtitle: "Tu director de contenidos",
      icon: <Sparkles className="w-6 h-6 text-amber-300" />,
      featured: true,
      badge: "Cerebro",
    },
    {
      id: "imagen",
      title: "IMAGEN IA",
      subtitle: "Genera imágenes increíbles",
      icon: <Image className="w-6 h-6 text-white" />,
    },
    {
      id: "video",
      title: "VÍDEO IA",
      subtitle: "Crea vídeos con IA",
      icon: <Video className="w-6 h-6 text-white" />,
      badge: "Popular",
    },
    {
      id: "audio",
      title: "AUDIO IA",
      subtitle: "Voz, música y efectos",
      icon: <Music className="w-6 h-6 text-white" />,
    },
    {
      id: "editor",
      title: "EDITOR IA",
      subtitle: "Edita y mejora tus creaciones",
      icon: <Sliders className="w-6 h-6 text-white" />,
    },
    {
      id: "plantillas",
      title: "PLANTILLAS",
      subtitle: "Plantillas prediseñadas",
      icon: <Flame className="w-6 h-6 text-white" />,
    },
    {
      id: "estudio_video",
      title: "MÁS HERRAMIENTAS",
      subtitle: "Todas las herramientas",
      icon: <Grid className="w-6 h-6 text-white" />,
    },
  ];

  const handleOpenProject = (proj: Project) => {
    setActiveProject(proj);
    if (proj.category === "director" || proj.scenes?.length) {
      setActiveView("director");
    } else if (proj.category === "video") {
      setActiveView("estudio_video");
    } else if (proj.category === "imagen") {
      setActiveView("estudio_visual");
    } else if (proj.category === "audio") {
      setActiveView("laboratorio_audio");
    } else {
      setActiveView("contenido");
    }
  };

  const handleStartRename = (proj: Project) => {
    setEditingProjectId(proj.id);
    setEditedName(proj.name);
    setActiveMenuId(null);
  };

  const handleSaveRename = (id: string) => {
    if (editedName.trim()) {
      updateProject(id, { name: editedName.trim() });
    }
    setEditingProjectId(null);
  };

  // Select project in progress
  const inProgressProject = activeProject || projects.find((p) => p.status === "in_progress") || projects[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          ¡Hola, {user.name}! 👋
        </h1>
        <p className="text-neutral-400 text-sm sm:text-base mt-1 font-medium">
          ¿Qué vamos a crear hoy?
        </p>
      </div>

      {/* 2. Main Tool Cards Grid */}
      <section>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {mainToolCards.map((card) => (
            <div
              key={card.id}
              id={`tool-card-${card.id}`}
              onClick={() => setActiveView(card.id)}
              className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between select-none ${
                card.featured
                  ? "bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 border-neutral-700 hover:border-neutral-400 hover:shadow-[0_0_24px_rgba(255,255,255,0.08)]"
                  : "bg-neutral-950 border-neutral-850 hover:border-neutral-700 hover:bg-neutral-900/60"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                    {card.icon}
                  </div>
                  {card.badge && (
                    <span className="text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/10 text-neutral-200 border border-white/10">
                      {card.badge}
                    </span>
                  )}
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-white tracking-wider group-hover:text-neutral-200 transition-colors">
                  {card.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-1">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
                <span>Abrir</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 & 4. Resumen Rápido & Proyecto en Curso (Side-by-Side 2 Columns) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Left Column: Resumen Rápido */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Resumen rápido
            </h2>
            <button
              onClick={() => setActiveView("estadisticas")}
              className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Ver todo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-neutral-950 border border-neutral-850 h-full">
            {/* 1: Target icon, 3 Generaciones, +2 que ayer */}
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white mb-2">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">3</div>
                <div className="text-xs text-neutral-400 font-medium mt-0.5">Generaciones</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+2 que ayer</span>
                </div>
              </div>
            </div>

            {/* 2: Clock icon, 1.2 h Ahorrado, +30m que ayer */}
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white mb-2">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">1.2 h</div>
                <div className="text-xs text-neutral-400 font-medium mt-0.5">Ahorrado</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+30m que ayer</span>
                </div>
              </div>
            </div>

            {/* 3: FolderKanban icon, 2 Proyectos, 1 completado */}
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white mb-2">
                <FolderKanban className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">2</div>
                <div className="text-xs text-neutral-400 font-medium mt-0.5">Proyectos</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>1 completado</span>
                </div>
              </div>
            </div>

            {/* 4: TrendingUp icon, 78% Productividad, +12% que ayer */}
            <div className="p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-850 flex flex-col justify-between">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-white mb-2">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">78%</div>
                <div className="text-xs text-neutral-400 font-medium mt-0.5">Productividad</div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12% que ayer</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Proyecto en Curso */}
        {inProgressProject && (
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Proyecto en curso
              </h2>
              <button
                onClick={() => handleOpenProject(inProgressProject)}
                className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Ver proyecto</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-850 flex flex-col justify-between h-full shadow-xl">
              <div className="flex items-center gap-4">
                {/* 9:16 Thumbnail */}
                <div className="relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 shrink-0">
                  <img
                    src={inProgressProject.thumbnail}
                    alt={inProgressProject.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-black/80 text-white">
                    {inProgressProject.format}
                  </span>
                </div>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      En producción
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white mt-1.5 truncate">
                    {inProgressProject.name}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-1 mt-0.5">
                    {inProgressProject.description}
                  </p>

                  {/* Progress Bar & Percentage */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-neutral-900 border border-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-white rounded-full transition-all duration-500"
                        style={{ width: `${inProgressProject.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-white whitespace-nowrap">
                      {inProgressProject.progress}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions Row */}
              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between">
                <span className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Última edición: {inProgressProject.lastEdited}
                </span>

                <button
                  id="continue-project-btn"
                  onClick={() => handleOpenProject(inProgressProject)}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continuar</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. Proyectos Recientes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Proyectos recientes
          </h2>
          <button
            onClick={() => setActiveView("proyectos")}
            className="text-xs font-semibold text-neutral-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Ver todos ({projects.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {projects.slice(0, 8).map((proj) => (
            <div
              key={proj.id}
              className="group relative p-3.5 rounded-2xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Thumbnail */}
                <div
                  onClick={() => handleOpenProject(proj)}
                  className="relative aspect-video w-full rounded-xl overflow-hidden bg-neutral-900 cursor-pointer"
                >
                  <img
                    src={proj.thumbnail}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/80 text-white">
                    {proj.category}
                  </span>
                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-white/90">
                    {proj.progress}%
                  </span>
                </div>

                {/* Name or Rename input */}
                <div className="mt-3 flex items-start justify-between gap-2">
                  {editingProjectId === proj.id ? (
                    <div className="flex-1">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={() => handleSaveRename(proj.id)}
                        onKeyDown={(e) => e.key === "Enter" && handleSaveRename(proj.id)}
                        autoFocus
                        className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-xs text-white"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => handleOpenProject(proj)}
                      className="cursor-pointer flex-1 min-w-0"
                    >
                      <h4 className="text-xs font-bold text-white truncate hover:text-neutral-200">
                        {proj.name}
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                        {proj.lastEdited}
                      </p>
                    </div>
                  )}

                  {/* Actions Dropdown Button */}
                  <div className="relative">
                    <button
                      onClick={() => setActiveMenuId(activeMenuId === proj.id ? null : proj.id)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === proj.id && (
                      <div className="absolute right-0 top-6 z-20 w-36 py-1 bg-neutral-900 border border-neutral-750 rounded-xl shadow-2xl text-xs">
                        <button
                          onClick={() => {
                            handleOpenProject(proj);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2"
                        >
                          <Play className="w-3 h-3" />
                          <span>Abrir</span>
                        </button>
                        <button
                          onClick={() => handleStartRename(proj)}
                          className="w-full px-3 py-1.5 text-left text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2"
                        >
                          <Edit2 className="w-3 h-3" />
                          <span>Renombrar</span>
                        </button>
                        <button
                          onClick={() => {
                            duplicateProject(proj.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Duplicar</span>
                        </button>
                        <div className="my-1 border-t border-neutral-800" />
                        <button
                          onClick={() => {
                            deleteProject(proj.id);
                            setActiveMenuId(null);
                          }}
                          className="w-full px-3 py-1.5 text-left text-red-400 hover:text-red-300 hover:bg-neutral-800 flex items-center gap-2"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Continue bar */}
              <div className="mt-3 pt-2 border-t border-neutral-900/80 flex items-center justify-between">
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  {proj.format}
                </span>
                <button
                  onClick={() => handleOpenProject(proj)}
                  className="text-[11px] font-bold text-white hover:text-neutral-300 flex items-center gap-1"
                >
                  <span>Continuar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
