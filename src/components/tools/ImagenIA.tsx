import React, { useState, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Image as ImageIcon,
  Sparkles,
  Upload,
  Download,
  Bookmark,
  PlusCircle,
  Video,
  RotateCw,
  Scissors,
  Type,
  Maximize2,
  Sliders,
  Check,
  Layers,
  Palette,
} from "lucide-react";

export const ImagenIA: React.FC = () => {
  const {
    spendPoints,
    addHistoryItem,
    addLibraryItem,
    createProject,
    activeProject,
    sendAssetToTool,
    addNotification,
    sharedAsset,
  } = useApp();

  // Generator states
  const [prompt, setPrompt] = useState(
    sharedAsset?.toolId === "imagen"
      ? sharedAsset.assetData?.prompt || ""
      : "Retrato cinemático de alta gama con iluminación de claroscuro, atmósfera oscura y textura ultra detallada 8k"
  );
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "16:9" | "4:5">("1:1");
  const [style, setStyle] = useState("Cinematográfico");
  const [isGenerating, setIsGenerating] = useState(false);

  // Active working image
  const [currentImage, setCurrentImage] = useState<string>(
    sharedAsset?.toolId === "imagen" && sharedAsset.assetData?.imageUrl
      ? sharedAsset.assetData.imageUrl
      : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80"
  );

  // Editing states
  const [rotation, setRotation] = useState(0);
  const [bgMode, setBgMode] = useState<"original" | "removed" | "studio" | "dark_gradient">("original");
  const [overlayText, setOverlayText] = useState("");
  const [filterBrightness, setFilterBrightness] = useState(100);
  const [filterContrast, setFilterContrast] = useState(100);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    if (!spendPoints(25, "Generación de imagen IA")) {
      return;
    }

    setIsGenerating(true);

    // Simulate high-tier neural render
    setTimeout(() => {
      setIsGenerating(false);
      // High-res curated visual matching the aesthetic
      const pool = [
        "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1000&auto=format&fit=crop&q=80",
      ];
      const nextImg = pool[Math.floor(Math.random() * pool.length)];
      setCurrentImage(nextImg);

      addHistoryItem({
        title: `Imagen: ${prompt.slice(0, 30)}`,
        tool: "Imagen IA",
        type: "imagen",
        pointsCost: 25,
        status: "completado",
        previewUrl: nextImg,
      });

      addNotification({
        title: "Imagen generada",
        message: "Tu imagen de alta resolución está lista en el editor.",
        type: "success",
        actionTool: "imagen",
      });
    }, 1200);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setCurrentImage(reader.result);
          addNotification({
            title: "Imagen cargada",
            message: "La imagen ha sido cargada correctamente para su edición.",
            type: "info",
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleSaveToLibrary = () => {
    addLibraryItem({
      title: `Creación Imagen - ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      type: "imagen",
      url: currentImage,
      category: "Imagen IA",
      prompt,
    });
  };

  const handleAddToProject = () => {
    if (activeProject) {
      addNotification({
        title: "Añadida al Proyecto",
        message: `Imagen vinculada al proyecto activo «${activeProject.name}».`,
        type: "success",
        actionTool: "proyectos",
      });
    } else {
      createProject({
        name: "Proyecto desde Imagen IA",
        thumbnail: currentImage,
        category: "imagen",
      });
    }
  };

  // Cross-tool connection: Send image to Video IA
  const handleSendToVideoIA = () => {
    sendAssetToTool("video", {
      imageUrl: currentImage,
      sourceMode: "imagen_a_video",
      prompt,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">IMAGEN IA</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Generación con IA, eliminación de fondos, edición y transferencia directa a vídeo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Send to Video IA button */}
          <button
            id="send-to-video-btn"
            onClick={handleSendToVideoIA}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-2 transition-all shadow-sm active:scale-95"
            title="Convertir esta imagen en un clip de vídeo con movimiento de cámara"
          >
            <Video className="w-4 h-4" />
            <span>Enviar a Vídeo IA</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Prompt & Generation Config */}
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-850 rounded-3xl p-5 space-y-5">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Prompt de Generación
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe con precisión qué imagen deseas generar..."
              className="w-full p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-neutral-600 resize-none"
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Formato / Proporción
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "1:1", label: "1:1 Cuadrado" },
                { id: "9:16", label: "9:16 Vertical" },
                { id: "16:9", label: "16:9 Cine" },
                { id: "4:5", label: "4:5 Retrato" },
              ].map((r) => (
                <button
                  key={r.id}
                  onClick={() => setAspectRatio(r.id as any)}
                  className={`p-2 rounded-xl border text-[11px] font-bold transition-all text-center ${
                    aspectRatio === r.id
                      ? "bg-white text-black border-white"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {r.id}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Estilo Visual
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold focus:outline-none"
            >
              <option value="Cinematográfico">Cinematográfico 8K</option>
              <option value="Fotográfico">Fotográfico de Estudio</option>
              <option value="Hiperrealista">Hiperrealista Chiaroscuro</option>
              <option value="Cyberpunk">Cyberpunk Neon</option>
              <option value="Minimalista">Minimalista Blanco y Negro</option>
              <option value="3D Render">3D Render Octane</option>
            </select>
          </div>

          {/* Generate Button */}
          <button
            id="generate-image-btn"
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generar Imagen (25 pts)</span>
              </>
            )}
          </button>

          {/* Or Upload Custom Image */}
          <div className="pt-3 border-t border-neutral-900">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center gap-2 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Cargar foto o imagen propia</span>
            </button>
          </div>
        </div>

        {/* Center / Right: Interactive Canvas Editor */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-850 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
          {/* Top Editor Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-neutral-900">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Eliminar Fondo */}
              <button
                onClick={() => setBgMode(bgMode === "removed" ? "original" : "removed")}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  bgMode === "removed"
                    ? "bg-white text-black border-white"
                    : "bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white"
                }`}
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>Eliminar Fondo</span>
              </button>

              {/* Cambiar Fondo */}
              <button
                onClick={() =>
                  setBgMode(
                    bgMode === "studio"
                      ? "dark_gradient"
                      : bgMode === "dark_gradient"
                      ? "original"
                      : "studio"
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Fondo: {bgMode}</span>
              </button>

              {/* Rotar */}
              <button
                onClick={handleRotate}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Rotar 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>

            {/* Actions: Save / Add to Project / Download */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToLibrary}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Guardar en Biblioteca"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToProject}
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Añadir a Proyecto"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <a
                href={currentImage}
                download="grey_ia_imagen.jpg"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Descargar imagen"
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Canvas Preview Stage */}
          <div className="my-6 flex items-center justify-center min-h-[380px] bg-neutral-900/30 rounded-2xl p-4 overflow-hidden relative">
            {/* Background color/gradient simulator */}
            <div
              className={`relative max-h-[460px] max-w-full rounded-2xl overflow-hidden shadow-2xl transition-all ${
                bgMode === "studio"
                  ? "bg-gradient-to-tr from-neutral-800 to-black p-4"
                  : bgMode === "dark_gradient"
                  ? "bg-gradient-to-b from-neutral-900 via-black to-neutral-950 p-4"
                  : ""
              }`}
            >
              <img
                src={currentImage}
                alt="Resultado Imagen IA"
                className="max-h-[420px] w-auto object-contain rounded-xl transition-all duration-300"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: `brightness(${filterBrightness}%) contrast(${filterContrast}%) ${
                    bgMode === "removed" ? "drop-shadow(0 15px 30px rgba(0,0,0,0.8))" : ""
                  }`,
                }}
              />

              {/* Live text overlay */}
              {overlayText && (
                <div className="absolute inset-x-0 bottom-6 text-center px-4">
                  <span className="font-extrabold text-white text-lg tracking-wider bg-black/60 px-4 py-1.5 rounded-xl backdrop-blur-md">
                    {overlayText}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Edit Bar: Add Text & Filters */}
          <div className="pt-4 border-t border-neutral-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Añadir Texto Superpuesto
              </label>
              <input
                type="text"
                value={overlayText}
                onChange={(e) => setOverlayText(e.target.value)}
                placeholder="Escribe texto sobre la imagen..."
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400 mb-1">
                <span>Brillo</span>
                <span>{filterBrightness}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                value={filterBrightness}
                onChange={(e) => setFilterBrightness(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400 mb-1">
                <span>Contraste</span>
                <span>{filterContrast}%</span>
              </div>
              <input
                type="range"
                min={50}
                max={150}
                value={filterContrast}
                onChange={(e) => setFilterContrast(Number(e.target.value))}
                className="w-full accent-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
