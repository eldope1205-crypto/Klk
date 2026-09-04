import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { HistoryItem } from "../../types";
import {
  Clock,
  RotateCcw,
  Sparkles,
  Zap,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  MessageSquare,
  Filter,
} from "lucide-react";

export const HistorialView: React.FC = () => {
  const { history, sendAssetToTool, addNotification, setActiveView } = useApp();
  const [filterTool, setFilterTool] = useState<string>("todos");

  const filteredHistory = history.filter((item) => {
    if (filterTool === "todos") return true;
    return item.type === filterTool;
  });

  const handleRecoverItem = (item: HistoryItem) => {
    if (item.type === "imagen") {
      sendAssetToTool("video", {
        imageUrl: item.previewUrl,
        prompt: item.title,
      });
      addNotification({
        title: "Recuperado en Vídeo IA",
        message: "Elemento cargado en el espacio de trabajo.",
        type: "info",
      });
    } else if (item.type === "video") {
      sendAssetToTool("estudio_video", {
        title: item.title,
      });
    } else if (item.type === "director") {
      setActiveView("director");
    } else if (item.type === "chat") {
      setActiveView("chat");
    } else {
      setActiveView("contenido");
    }
  };

  const getIcon = (type: HistoryItem["type"]) => {
    switch (type) {
      case "director":
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      case "imagen":
        return <ImageIcon className="w-4 h-4 text-white" />;
      case "video":
        return <Video className="w-4 h-4 text-white" />;
      case "audio":
        return <Music className="w-4 h-4 text-white" />;
      case "chat":
        return <MessageSquare className="w-4 h-4 text-white" />;
      default:
        return <FileText className="w-4 h-4 text-white" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">HISTORIAL</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Registro completo de todas las generaciones, tareas y consumos de puntos de GREY IA.
            </p>
          </div>
        </div>

        <span className="text-xs text-neutral-400 font-semibold">
          {history.length} registros
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "todos", label: "Todos los eventos" },
          { id: "director", label: "Director IA" },
          { id: "video", label: "Vídeo" },
          { id: "imagen", label: "Imagen" },
          { id: "audio", label: "Audio" },
          { id: "contenido", label: "Contenido" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterTool(f.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterTool === f.id
                ? "bg-white text-black font-bold shadow-sm"
                : "bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* History Items List */}
      <div className="space-y-3">
        {filteredHistory.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-3xl bg-neutral-950 border border-neutral-850 hover:border-neutral-750 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white truncate">{item.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-neutral-900 text-neutral-400 border border-neutral-800">
                    {item.tool}
                  </span>
                </div>
                <div className="text-xs text-neutral-400 mt-0.5 truncate">
                  {item.details || "Generación completada exitosamente."}
                </div>
                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-neutral-500">
                  <span>{item.timestamp}</span>
                  {item.pointsCost > 0 && (
                    <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                      <Zap className="w-3 h-3" />
                      -{item.pointsCost} pts
                    </span>
                  )}
                  <span className="text-emerald-400 font-semibold uppercase text-[10px]">
                    ● {item.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Recovery Action */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleRecoverItem(item)}
                className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-white text-neutral-300 hover:text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reutilizar / Abrir</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
