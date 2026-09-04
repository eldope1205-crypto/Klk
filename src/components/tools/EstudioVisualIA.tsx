import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Layers,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  RotateCw,
  Download,
  Trash2,
  Move,
  Maximize2,
  Plus,
  Eye,
  EyeOff,
  Palette,
} from "lucide-react";

interface CanvasLayer {
  id: string;
  name: string;
  type: "text" | "rect" | "circle" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color?: string;
  text?: string;
  fontSize?: number;
  imageUrl?: string;
  visible: boolean;
}

export const EstudioVisualIA: React.FC = () => {
  const { addLibraryItem, addNotification } = useApp();

  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: "l_bg",
      name: "Fondo Oscuro Gradiente",
      type: "rect",
      x: 0,
      y: 0,
      width: 500,
      height: 500,
      rotation: 0,
      color: "#0a0a0a",
      visible: true,
    },
    {
      id: "l_img",
      name: "Imagen Visual IA",
      type: "image",
      x: 50,
      y: 50,
      width: 400,
      height: 300,
      rotation: 0,
      imageUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      visible: true,
    },
    {
      id: "l_txt",
      name: "Título Tipográfico",
      type: "text",
      x: 70,
      y: 380,
      width: 360,
      height: 60,
      rotation: 0,
      text: "GREY IA — ESTUDIO VISUAL",
      fontSize: 22,
      color: "#ffffff",
      visible: true,
    },
  ]);

  const [selectedLayerId, setSelectedLayerId] = useState<string>("l_txt");
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  const handleAddText = () => {
    const newL: CanvasLayer = {
      id: "l_txt_" + Date.now(),
      name: "Texto Nuevo",
      type: "text",
      x: 100,
      y: 200,
      width: 250,
      height: 40,
      rotation: 0,
      text: "Texto Cinematográfico",
      fontSize: 20,
      color: "#ffffff",
      visible: true,
    };
    setLayers([...layers, newL]);
    setSelectedLayerId(newL.id);
  };

  const handleAddRect = () => {
    const newL: CanvasLayer = {
      id: "l_rect_" + Date.now(),
      name: "Rectángulo",
      type: "rect",
      x: 120,
      y: 120,
      width: 160,
      height: 100,
      rotation: 0,
      color: "#262626",
      visible: true,
    };
    setLayers([...layers, newL]);
    setSelectedLayerId(newL.id);
  };

  const handleAddCircle = () => {
    const newL: CanvasLayer = {
      id: "l_circ_" + Date.now(),
      name: "Círculo",
      type: "circle",
      x: 180,
      y: 180,
      width: 120,
      height: 120,
      rotation: 0,
      color: "#ffffff",
      visible: true,
    };
    setLayers([...layers, newL]);
    setSelectedLayerId(newL.id);
  };

  const handleDeleteLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(layers[0]?.id || "");
  };

  const handleToggleVisibility = (id: string) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, visible: !l.visible } : l)));
  };

  const handleExport = () => {
    addLibraryItem({
      title: "Diseño Gráfico Estudio Visual",
      type: "imagen",
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
      category: "Estudio Visual IA",
    });
    addNotification({
      title: "Diseño exportado",
      message: "Tu composición gráfica se ha guardado en la Biblioteca.",
      type: "success",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              ESTUDIO VISUAL IA
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Lienzo gráfico por capas, textos, vectores y composición cinematográfica.
            </p>
          </div>
        </div>

        <button
          id="export-visual-studio-btn"
          onClick={handleExport}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Composición</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tools & Layers Panel */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Add Elements */}
          <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-850 space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Añadir Elemento
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleAddText}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <Type className="w-4 h-4" />
                <span>Texto</span>
              </button>
              <button
                onClick={handleAddRect}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <Square className="w-4 h-4" />
                <span>Rectángulo</span>
              </button>
              <button
                onClick={handleAddCircle}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs font-semibold flex flex-col items-center gap-1 transition-colors"
              >
                <Circle className="w-4 h-4" />
                <span>Círculo</span>
              </button>
            </div>
          </div>

          {/* Layers List */}
          <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-850 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Capas del Lienzo ({layers.length})
              </span>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {[...layers].reverse().map((layer) => (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                    selectedLayerId === layer.id
                      ? "bg-neutral-900 border-neutral-700 text-white font-bold"
                      : "bg-neutral-950/60 border-neutral-900 text-neutral-400 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {layer.type === "text" && <Type className="w-3.5 h-3.5 text-neutral-400" />}
                    {layer.type === "rect" && <Square className="w-3.5 h-3.5 text-neutral-400" />}
                    {layer.type === "circle" && <Circle className="w-3.5 h-3.5 text-neutral-400" />}
                    {layer.type === "image" && <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />}
                    <span className="truncate">{layer.name}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleVisibility(layer.id);
                      }}
                      className="p-1 rounded hover:text-white"
                    >
                      {layer.visible ? (
                        <Eye className="w-3.5 h-3.5" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-neutral-600" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLayer(layer.id);
                      }}
                      className="p-1 rounded hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Layer Properties */}
          {selectedLayer && (
            <div className="p-4 rounded-3xl bg-neutral-950 border border-neutral-850 space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                Propiedades: {selectedLayer.name}
              </span>

              {selectedLayer.type === "text" && (
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Contenido</label>
                  <input
                    type="text"
                    value={selectedLayer.text || ""}
                    onChange={(e) =>
                      setLayers(
                        layers.map((l) =>
                          l.id === selectedLayer.id ? { ...l, text: e.target.value } : l
                        )
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Posición X</label>
                  <input
                    type="number"
                    value={selectedLayer.x}
                    onChange={(e) =>
                      setLayers(
                        layers.map((l) =>
                          l.id === selectedLayer.id ? { ...l, x: Number(e.target.value) } : l
                        )
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-neutral-500 mb-1">Posición Y</label>
                  <input
                    type="number"
                    value={selectedLayer.y}
                    onChange={(e) =>
                      setLayers(
                        layers.map((l) =>
                          l.id === selectedLayer.id ? { ...l, y: Number(e.target.value) } : l
                        )
                      )
                    }
                    className="w-full px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Center / Right: The Visual Stage */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-850 rounded-3xl p-6 flex items-center justify-center min-h-[500px] overflow-hidden shadow-2xl">
          {/* 500x500 Interactive Stage */}
          <div
            className="relative w-[500px] h-[500px] bg-black border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl select-none"
            style={{ maxWidth: "100%", maxHeight: "500px" }}
          >
            {layers.map((layer) => {
              if (!layer.visible) return null;
              const isSelected = selectedLayerId === layer.id;

              return (
                <div
                  key={layer.id}
                  onClick={() => setSelectedLayerId(layer.id)}
                  style={{
                    position: "absolute",
                    left: `${layer.x}px`,
                    top: `${layer.y}px`,
                    width: `${layer.width}px`,
                    height: `${layer.height}px`,
                    transform: `rotate(${layer.rotation}deg)`,
                    cursor: "pointer",
                  }}
                  className={`transition-shadow ${
                    isSelected ? "ring-2 ring-white ring-offset-2 ring-offset-black" : ""
                  }`}
                >
                  {layer.type === "image" && layer.imageUrl && (
                    <img
                      src={layer.imageUrl}
                      alt={layer.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  )}

                  {layer.type === "rect" && (
                    <div
                      className="w-full h-full rounded-xl"
                      style={{ backgroundColor: layer.color || "#333" }}
                    />
                  )}

                  {layer.type === "circle" && (
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: layer.color || "#fff" }}
                    />
                  )}

                  {layer.type === "text" && (
                    <div
                      className="w-full h-full font-black tracking-wider flex items-center"
                      style={{
                        color: layer.color || "#fff",
                        fontSize: `${layer.fontSize || 18}px`,
                      }}
                    >
                      {layer.text}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
