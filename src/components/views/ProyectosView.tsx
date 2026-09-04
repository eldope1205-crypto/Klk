import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { Project } from "../../types";
import {
  FolderKanban,
  Plus,
  Search,
  MoreVertical,
  Play,
  Edit2,
  Copy,
  Trash2,
  Clock,
  CheckCircle,
  Filter,
} from "lucide-react";

export const ProyectosView: React.FC = () => {
  const {
    projects,
    createProject,
    duplicateProject,
    deleteProject,
    updateProject,
    setActiveProject,
    setActiveView,
    setCreateModalOpen,
  } = useApp();

  const [filter, setFilter] = useState<string>("todos");
  const [search, setSearch] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");

  const filters = [
    { id: "todos", label: "Todos" },
    { id: "in_progress", label: "En curso" },
    { id: "completed", label: "Terminados" },
    { id: "video", label: "Vídeos" },
    { id: "imagen", label: "Imágenes" },
    { id: "audio", label: "Audio" },
  ];

  const filteredProjects = projects.filter((p) => {
    let matchFilter = true;
    if (filter === "in_progress") matchFilter = p.status === "in_progress";
    else if (filter === "completed") matchFilter = p.status === "completed";
    else if (filter === "video") matchFilter = p.category === "video" || p.category === "director";
    else if (filter === "imagen") matchFilter = p.category === "imagen";
    else if (filter === "audio") matchFilter = p.category === "audio";

    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());

    return matchFilter && matchSearch;
  });

  const handleOpenProject = (p: Project) => {
    setActiveProject(p);
    if (p.category === "director" || p.scenes?.length) {
      setActiveView("director");
    } else if (p.category === "video") {
      setActiveView("estudio_video");
    } else if (p.category === "imagen") {
      setActiveView("estudio_visual");
    } else if (p.category === "audio") {
      setActiveView("laboratorio_audio");
    } else {
      setActiveView("contenido");
    }
  };

  const handleStartRename = (p: Project) => {
    setEditingId(p.id);
    setNameInput(p.name);
    setActiveMenuId(null);
  };

  const handleSaveRename = (id: string) => {
    if (nameInput.trim()) {
      updateProject(id, { name: nameInput.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">PROYECTOS</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Gestión centralizada de tus producciones audiovisuales activas y archivadas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="new-project-top-btn"
            onClick={() => setCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.id
                  ? "bg-white text-black font-bold shadow-sm"
                  : "bg-neutral-950 border border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white focus:outline-none focus:border-neutral-600"
          />
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProjects.map((p) => (
          <div
            key={p.id}
            className="group relative p-4 rounded-3xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              {/* Thumbnail */}
              <div
                onClick={() => handleOpenProject(p)}
                className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 mb-3 cursor-pointer"
              >
                <img
                  src={p.thumbnail}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-black/80 text-white">
                  {p.format}
                </span>
                <span className="absolute bottom-2 right-2 text-[10px] font-bold text-white">
                  {p.progress}%
                </span>
              </div>

              {/* Title & Rename Input */}
              <div className="flex items-start justify-between gap-2">
                {editingId === p.id ? (
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={() => handleSaveRename(p.id)}
                    onKeyDown={(e) => e.key === "Enter" && handleSaveRename(p.id)}
                    autoFocus
                    className="w-full px-2 py-1 rounded bg-neutral-900 border border-neutral-700 text-xs text-white"
                  />
                ) : (
                  <div
                    onClick={() => handleOpenProject(p)}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <h3 className="text-sm font-bold text-white truncate hover:text-neutral-200">
                      {p.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">
                      {p.description}
                    </p>
                  </div>
                )}

                {/* Dropdown Menu */}
                <div className="relative">
                  <button
                    onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                    className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-900"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === p.id && (
                    <div className="absolute right-0 top-6 z-20 w-36 py-1 bg-neutral-900 border border-neutral-750 rounded-xl shadow-2xl text-xs">
                      <button
                        onClick={() => {
                          handleOpenProject(p);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-3 py-1.5 text-left text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Play className="w-3 h-3" />
                        <span>Abrir</span>
                      </button>
                      <button
                        onClick={() => handleStartRename(p)}
                        className="w-full px-3 py-1.5 text-left text-neutral-200 hover:text-white hover:bg-neutral-800 flex items-center gap-2"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Renombrar</span>
                      </button>
                      <button
                        onClick={() => {
                          duplicateProject(p.id);
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
                          deleteProject(p.id);
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

            {/* Bottom Status Bar */}
            <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {p.lastEdited}
              </span>
              <button
                onClick={() => handleOpenProject(p)}
                className="font-bold text-white hover:text-neutral-300 flex items-center gap-1"
              >
                Continuar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
