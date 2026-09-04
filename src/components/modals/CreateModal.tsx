import React from "react";
import { useApp } from "../../context/AppContext";
import { ToolId } from "../../types";
import {
  Sparkles,
  MessageSquare,
  FileText,
  Image,
  Video,
  Music,
  Film,
  Layers,
  Sliders,
  X,
  ArrowUpRight,
} from "lucide-react";

export const CreateModal: React.FC = () => {
  const { createModalOpen, setCreateModalOpen, setActiveView } = useApp();

  if (!createModalOpen) return null;

  const creationOptions: {
    id: ToolId;
    title: string;
    description: string;
    icon: React.ReactNode;
    tag?: string;
    hot?: boolean;
  }[] = [
    {
      id: "director",
      title: "Director IA",
      description: "Crea una producción completa con una sola frase (guion, vídeo, audio, música)",
      icon: <Sparkles className="w-5 h-5 text-amber-300" />,
      tag: "Recomendado",
      hot: true,
    },
    {
      id: "video",
      title: "Vídeo IA",
      description: "Texto a vídeo, Imagen a vídeo, Foto a vídeo o Varias imágenes",
      icon: <Video className="w-5 h-5 text-white" />,
      tag: "Popular",
    },
    {
      id: "imagen",
      title: "Imagen IA",
      description: "Genera imágenes fotorrealistas y edita con eliminación de fondo",
      icon: <Image className="w-5 h-5 text-white" />,
    },
    {
      id: "audio",
      title: "Audio IA & Voces",
      description: "Convierte texto a voz natural y genera fondos sonoros cinemáticos",
      icon: <Music className="w-5 h-5 text-white" />,
    },
    {
      id: "contenido",
      title: "Generador de Contenido",
      description: "Guiones, ganchos virales y hashtags para TikTok, Shorts y Reels",
      icon: <FileText className="w-5 h-5 text-white" />,
    },
    {
      id: "chat",
      title: "Chat IA",
      description: "Conversa y desglosa ideas con modelos de inteligencia artificial",
      icon: <MessageSquare className="w-5 h-5 text-white" />,
    },
    {
      id: "estudio_video",
      title: "Estudio de Vídeo IA",
      description: "Editor multipista profesional con subtítulos y efectos",
      icon: <Film className="w-5 h-5 text-white" />,
    },
    {
      id: "estudio_visual",
      title: "Estudio Visual IA",
      description: "Lienzo de diseño gráfico con capas, textos y formas",
      icon: <Layers className="w-5 h-5 text-white" />,
    },
    {
      id: "laboratorio_audio",
      title: "Laboratorio de Audio",
      description: "Mezclador multipista de voces, música y efectos sonoros",
      icon: <Sliders className="w-5 h-5 text-white" />,
    },
  ];

  const handleLaunch = (id: ToolId) => {
    setActiveView(id);
    setCreateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
          <div>
            <h2 className="text-xl font-extrabold text-white tracking-wide">¿Qué deseas crear hoy?</h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Selecciona una herramienta para comenzar tu producción audiovisual.
            </p>
          </div>
          <button
            onClick={() => setCreateModalOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1">
          {creationOptions.map((opt) => (
            <div
              key={opt.id}
              onClick={() => handleLaunch(opt.id)}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                opt.hot
                  ? "bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-950 border-neutral-700 hover:border-white shadow-lg"
                  : "bg-neutral-900/60 border-neutral-850 hover:border-neutral-700 hover:bg-neutral-900"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-xl bg-neutral-800/80 border border-neutral-700/60">
                    {opt.icon}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {opt.tag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/10 text-neutral-200 border border-white/15">
                        {opt.tag}
                      </span>
                    )}
                    <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-neutral-200 transition-colors">
                  {opt.title}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                  {opt.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
