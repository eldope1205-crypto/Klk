import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { ToolId } from "../../types";
import {
  Sliders,
  Film,
  Image as ImageIcon,
  Music,
  Type,
  ArrowRight,
  Sparkles,
  Layers,
  Scissors,
  Wand2,
} from "lucide-react";

export const EditorIA: React.FC = () => {
  const { setActiveView, projects, activeProject, setActiveProject } = useApp();

  const editModules: {
    title: string;
    description: string;
    icon: React.ReactNode;
    toolId: ToolId;
    badge?: string;
    features: string[];
  }[] = [
    {
      title: "Edición de Vídeos",
      description: "Editor de vídeo multipista, corte de clips, transiciones y montaje completo.",
      icon: <Film className="w-6 h-6 text-white" />,
      toolId: "estudio_video",
      badge: "Multipista",
      features: ["Recorte y división", "Subtítulos sincronizados", "Formatos 9:16 y 16:9"],
    },
    {
      title: "Edición de Imágenes & Gráficos",
      description: "Eliminación inteligente de fondos, cambio de lienzo, filtros y exportación.",
      icon: <ImageIcon className="w-6 h-6 text-white" />,
      toolId: "imagen",
      features: ["Eliminar fondo con 1 clic", "Rotación y reescalado", "Texto superpuesto"],
    },
    {
      title: "Estudio Visual & Capas",
      description: "Diseño gráfico por capas con vectores, tipografías y formas geométricas.",
      icon: <Layers className="w-6 h-6 text-white" />,
      toolId: "estudio_visual",
      features: ["Gestor de capas", "Formas geométricas", "Composiciones para redes"],
    },
    {
      title: "Edición y Mezcla de Audio",
      description: "Laboratorio multipista para balancear voces, música ambiental y efectos SFX.",
      icon: <Music className="w-6 h-6 text-white" />,
      toolId: "laboratorio_audio",
      features: ["Control de volumen independiente", "Corte de ondas de audio", "Exportación WAV"],
    },
    {
      title: "Generador y Editor de Texto",
      description: "Generación de guiones, ganchos de retención y optimización para redes sociales.",
      icon: <Type className="w-6 h-6 text-white" />,
      toolId: "contenido",
      features: ["Guiones para TikTok/Shorts", "Hashtags y descripciones", "Llamadas a la acción"],
    },
    {
      title: "Orquestador Director IA",
      description: "Si necesitas rehacer o modificar todo el plan de producción automáticamente.",
      icon: <Sparkles className="w-6 h-6 text-amber-300" />,
      toolId: "director",
      badge: "Cerebro",
      features: ["Regeneración de escenas", "Cambio de estilo visual", "Dirección completa"],
    },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">EDITOR IA</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Centro de edición inteligente conectado con todos los motores de producción de GREY IA.
            </p>
          </div>
        </div>
      </div>

      {/* Projects in Progress for Quick Edit */}
      {projects.length > 0 && (
        <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Proyectos listos para editar
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {projects.slice(0, 3).map((p) => (
              <div
                key={p.id}
                onClick={() => {
                  setActiveProject(p);
                  setActiveView("estudio_video");
                }}
                className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer flex items-center gap-3 group"
              >
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-12 h-12 rounded-xl object-cover border border-neutral-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-white truncate group-hover:text-neutral-200">
                    {p.name}
                  </h4>
                  <span className="text-[10px] text-neutral-400">{p.format} • {p.progress}% completado</span>
                </div>
                <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {editModules.map((mod) => (
          <div
            key={mod.title}
            onClick={() => setActiveView(mod.toolId)}
            className="group p-5 rounded-3xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 hover:bg-neutral-900/40 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800">
                  {mod.icon}
                </div>
                {mod.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/10 text-neutral-200 border border-white/10">
                    {mod.badge}
                  </span>
                )}
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-neutral-200">
                {mod.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                {mod.description}
              </p>

              <ul className="mt-4 space-y-1">
                {mod.features.map((f, i) => (
                  <li key={i} className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-600" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs font-semibold text-neutral-400 group-hover:text-white">
              <span>Abrir editor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
