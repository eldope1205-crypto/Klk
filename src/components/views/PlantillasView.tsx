import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { initialTemplates } from "../../data/initialData";
import { Template } from "../../types";
import {
  Flame,
  Search,
  ArrowRight,
  Play,
  Film,
  Sparkles,
  Layers,
  Clock,
} from "lucide-react";

export const PlantillasView: React.FC = () => {
  const { createProject, setActiveView, sendAssetToTool, addNotification } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "todas", label: "Todas" },
    { id: "shorts", label: "Shorts & TikTok" },
    { id: "reels", label: "Reels" },
    { id: "anuncios", label: "Anuncios Comerciales" },
    { id: "miniaturas", label: "Miniaturas & Gráficos" },
    { id: "historias", label: "Historias" },
  ];

  const filteredTemplates = initialTemplates.filter((t) => {
    const matchesCat = selectedCategory === "todas" || t.category === selectedCategory;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseTemplate = (tpl: Template) => {
    // Automatically instantiate into a new project
    createProject({
      name: `Copia de ${tpl.title}`,
      description: tpl.description,
      thumbnail: tpl.thumbnail,
      category: tpl.category === "miniaturas" ? "imagen" : "video",
      format: tpl.format,
      durationSeconds: tpl.durationSeconds,
    });

    if (tpl.category === "miniaturas") {
      setActiveView("estudio_visual");
    } else {
      sendAssetToTool("estudio_video", {
        format: tpl.format,
        duration: tpl.durationSeconds,
        title: tpl.title,
      });
    }

    addNotification({
      title: "Plantilla cargada",
      message: `La plantilla «${tpl.title}» ha sido clonada en tu espacio de trabajo.`,
      type: "success",
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">PLANTILLAS</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Plantillas prediseñadas para Shorts, TikTok, anuncios virales y miniaturas.
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar plantilla..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === c.id
                ? "bg-white text-black shadow-sm"
                : "bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="group p-4 rounded-3xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Thumbnail Container */}
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 mb-4">
                <img
                  src={tpl.thumbnail}
                  alt={tpl.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-white">
                  {tpl.format}
                </span>
                {tpl.durationSeconds && (
                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-neutral-300 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {tpl.durationSeconds}s
                  </span>
                )}
              </div>

              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                {tpl.category}
              </span>
              <h3 className="text-base font-bold text-white mt-1 group-hover:text-neutral-200">
                {tpl.title}
              </h3>
              <p className="text-xs text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                {tpl.description}
              </p>
            </div>

            {/* Use Template Action */}
            <div className="mt-5 pt-3 border-t border-neutral-900 flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">Lista para producción</span>
              <button
                id={`use-tpl-${tpl.id}`}
                onClick={() => handleUseTemplate(tpl)}
                className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <span>Usar plantilla</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
