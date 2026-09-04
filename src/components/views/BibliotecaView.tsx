import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { LibraryItem } from "../../types";
import {
  Library,
  Image as ImageIcon,
  Video,
  Music,
  FileText,
  Trash2,
  ExternalLink,
  PlusCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export const BibliotecaView: React.FC = () => {
  const { library, deleteLibraryItem, sendAssetToTool, setActiveView, addNotification } = useApp();

  const [filterType, setFilterType] = useState<string>("todos");

  const filteredItems = library.filter((item) => {
    if (filterType === "todos") return true;
    return item.type === filterType;
  });

  const handleReuseInProject = (item: LibraryItem) => {
    if (item.type === "imagen") {
      sendAssetToTool("video", {
        imageUrl: item.url,
        prompt: item.prompt || item.title,
        sourceMode: "imagen_a_video",
      });
      addNotification({
        title: "Imagen cargada en Vídeo IA",
        message: "Puedes animar esta imagen ahora mismo.",
        type: "info",
        actionTool: "video",
      });
    } else if (item.type === "video") {
      sendAssetToTool("estudio_video", {
        videoUrl: item.url,
        title: item.title,
      });
      addNotification({
        title: "Vídeo añadido al Estudio",
        message: "Vídeo cargado en el editor multipista.",
        type: "info",
        actionTool: "estudio_video",
      });
    } else if (item.type === "audio") {
      sendAssetToTool("laboratorio_audio", {
        trackName: item.title,
        type: "musica",
      });
    } else {
      setActiveView("contenido");
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">BIBLIOTECA</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Repositorio de todos tus archivos multimedia, imágenes generadas, pistas y guiones.
            </p>
          </div>
        </div>

        <span className="text-xs text-neutral-400 font-semibold">
          {library.length} elementos almacenados
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "todos", label: "Todos" },
          { id: "imagen", label: "Imágenes" },
          { id: "video", label: "Vídeos" },
          { id: "audio", label: "Audios" },
          { id: "texto", label: "Textos y Guiones" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterType(f.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filterType === f.id
                ? "bg-white text-black font-bold shadow-sm"
                : "bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredItems.map((item) => {
          const typeIcons = {
            imagen: <ImageIcon className="w-4 h-4 text-white" />,
            video: <Video className="w-4 h-4 text-white" />,
            audio: <Music className="w-4 h-4 text-white" />,
            texto: <FileText className="w-4 h-4 text-white" />,
          };

          return (
            <div
              key={item.id}
              className="group p-4 rounded-3xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                {/* Visual Preview */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 mb-3 flex items-center justify-center">
                  {item.url && (item.type === "imagen" || item.type === "video") ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="p-4 rounded-2xl bg-neutral-800 text-white">
                      {typeIcons[item.type]}
                    </div>
                  )}

                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/80 text-white">
                    {item.category}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold text-white truncate">{item.title}</h3>
                    <p className="text-[10px] text-neutral-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.createdAt}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteLibraryItem(item.id)}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 transition-colors"
                    title="Eliminar de la biblioteca"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Reutilizar Action Button */}
              <div className="mt-4 pt-2.5 border-t border-neutral-900 flex items-center justify-between">
                <button
                  onClick={() => handleReuseInProject(item)}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-white text-neutral-300 hover:text-black text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Reutilizar en Proyecto</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
