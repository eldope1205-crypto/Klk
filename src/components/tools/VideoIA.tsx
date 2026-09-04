import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Video as VideoIcon,
  Sparkles,
  Upload,
  Play,
  Film,
  Camera,
  Music,
  Sliders,
  ArrowRight,
  Maximize2,
  CheckCircle,
} from "lucide-react";

export const VideoIA: React.FC = () => {
  const {
    spendPoints,
    addHistoryItem,
    addLibraryItem,
    sendAssetToTool,
    addNotification,
    sharedAsset,
    clearSharedAsset,
  } = useApp();

  const [generationMode, setGenerationMode] = useState<
    "texto_a_video" | "imagen_a_video" | "foto_a_video" | "varias_imagenes"
  >(
    sharedAsset?.toolId === "video" && sharedAsset.assetData?.sourceMode
      ? (sharedAsset.assetData.sourceMode as any)
      : "texto_a_video"
  );

  const [prompt, setPrompt] = useState(
    sharedAsset?.toolId === "video" && sharedAsset.assetData?.prompt
      ? sharedAsset.assetData.prompt
      : "Cámara en movimiento orbital lento revelando un paisaje lunar con atmósfera oscura y partículas suspendidas"
  );

  const [uploadedImage, setUploadedImage] = useState<string>(
    sharedAsset?.toolId === "video" && sharedAsset.assetData?.imageUrl
      ? sharedAsset.assetData.imageUrl
      : "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80"
  );

  const [duration, setDuration] = useState<number>(5);
  const [format, setFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const [cameraMotion, setCameraMotion] = useState("Movimiento orbital suave");
  const [style, setStyle] = useState("Cinematográfico 8K");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(true);

  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState("");
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  // Clear shared asset consumed
  useEffect(() => {
    if (sharedAsset?.toolId === "video") {
      clearSharedAsset();
    }
  }, []);

  const handleStartGeneration = () => {
    if (!spendPoints(40, `Vídeo IA (${duration}s, ${format}, ${resolution})`)) {
      return;
    }

    setIsGenerating(true);
    setProgress(5);
    setGenerationStep("Calculando trayectorias de cámara y fotogramas clave...");

    const steps = [
      { p: 25, step: "Generando coherencia espacial y profundidad 3D..." },
      { p: 55, step: "Interpolando movimiento temporal y fluidez (24fps)..." },
      { p: 80, step: "Añadiendo post-procesado cinematográfico y grano de película..." },
      { p: 95, step: "Codificando vídeo MP4 en alta resolución..." },
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].p);
        setGenerationStep(steps[current].step);
        current++;
      } else {
        clearInterval(interval);
        setProgress(100);
        setIsGenerating(false);

        // High quality preview video placeholder
        const demoVideo = "https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4";
        setGeneratedVideoUrl(demoVideo);

        addHistoryItem({
          title: `Vídeo IA: ${prompt.slice(0, 30)}`,
          tool: "Vídeo IA",
          type: "video",
          pointsCost: 40,
          status: "completado",
          previewUrl: uploadedImage,
        });

        addNotification({
          title: "Vídeo IA renderizado",
          message: "Tu vídeo ha sido generado con éxito y está listo para previsualizar.",
          type: "success",
          actionTool: "video",
        });
      }
    }, 1000);
  };

  const handleSendToStudio = () => {
    sendAssetToTool("estudio_video", {
      videoUrl: generatedVideoUrl || uploadedImage,
      format,
      duration,
      title: `Clip Vídeo IA (${format})`,
    });
  };

  const handleSaveToLibrary = () => {
    addLibraryItem({
      title: `Vídeo Generado - ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
      type: "video",
      url: generatedVideoUrl || uploadedImage,
      category: "Vídeo IA",
      prompt,
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <VideoIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">VÍDEO IA</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Generación de vídeo a partir de texto, imágenes o fotos con control de cámara.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {generatedVideoUrl && (
            <button
              id="video-send-to-studio-btn"
              onClick={handleSendToStudio}
              className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Film className="w-4 h-4" />
              <span>Enviar al Estudio de Vídeo IA</span>
            </button>
          )}
        </div>
      </div>

      {/* Mode Selector Tabs: TEXTO → VÍDEO | IMAGEN → VÍDEO | FOTO → VÍDEO | VARIAS IMÁGENES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "texto_a_video", label: "Texto → Vídeo" },
          { id: "imagen_a_video", label: "Imagen → Vídeo" },
          { id: "foto_a_video", label: "Foto → Vídeo" },
          { id: "varias_imagenes", label: "Varias Imágenes" },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => setGenerationMode(m.id as any)}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all text-center ${
              generationMode === m.id
                ? "bg-white text-black border-white shadow-md font-extrabold"
                : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Configuration Form */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-850 rounded-3xl p-5 space-y-4">
          {/* Prompt */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Prompt de Vídeo
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe la escena, los movimientos y los efectos visuales..."
              className="w-full p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-neutral-600 resize-none"
            />
          </div>

          {/* Reference Image upload if not text-only */}
          {generationMode !== "texto_a_video" && (
            <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-2">
                Imagen de Referencia
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={uploadedImage}
                  alt="Referencia"
                  className="w-16 h-16 rounded-xl object-cover border border-neutral-700"
                />
                <div className="flex-1 text-xs">
                  <div className="text-white font-medium truncate">Imagen cargada</div>
                  <label className="mt-1 inline-block text-[11px] text-neutral-400 hover:text-white cursor-pointer underline">
                    Cambiar imagen
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const r = new FileReader();
                          r.onload = () => {
                            if (typeof r.result === "string") setUploadedImage(r.result);
                          };
                          r.readAsDataURL(f);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Format & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Formato
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              >
                <option value="9:16">9:16 (Vertical TikTok/Shorts)</option>
                <option value="16:9">16:9 (Horizontal Cine/YT)</option>
                <option value="1:1">1:1 (Cuadrado)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Duración
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              >
                <option value={3}>3 segundos</option>
                <option value={5}>5 segundos (Recomendado)</option>
                <option value={10}>10 segundos</option>
              </select>
            </div>
          </div>

          {/* Camera Motion */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
              Movimiento de Cámara
            </label>
            <select
              value={cameraMotion}
              onChange={(e) => setCameraMotion(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
            >
              <option value="Movimiento orbital suave">Movimiento orbital suave</option>
              <option value="Zoom In cinematográfico">Zoom In cinematográfico</option>
              <option value="Zoom Out revelador">Zoom Out revelador</option>
              <option value="Paneo horizontal (Pan)">Paneo horizontal (Pan)</option>
              <option value="Inclinación vertical (Tilt)">Inclinación vertical (Tilt)</option>
              <option value="Cámara estática fija">Cámara estática fija</option>
            </select>
          </div>

          {/* Resolution & Style */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Resolución
              </label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              >
                <option value="1080p">1080p Full HD</option>
                <option value="720p">720p Rápido</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Estilo
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              >
                <option value="Cinematográfico 8K">Cinematográfico 8K</option>
                <option value="Hiperrealista">Hiperrealista</option>
                <option value="Cyberpunk">Cyberpunk</option>
                <option value="Anime Cinemático">Anime Cinemático</option>
              </select>
            </div>
          </div>

          {/* Quick Toggles: Voice, Music, Subtitles */}
          <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Locución de Voz IA</span>
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="accent-white"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Música de fondo ambiental</span>
              <input
                type="checkbox"
                checked={musicEnabled}
                onChange={(e) => setMusicEnabled(e.target.checked)}
                className="accent-white"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-300 font-medium">Subtítulos automáticos</span>
              <input
                type="checkbox"
                checked={subtitlesEnabled}
                onChange={(e) => setSubtitlesEnabled(e.target.checked)}
                className="accent-white"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="video-generate-btn"
            onClick={handleStartGeneration}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generar Vídeo (40 pts)</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Stage Preview & Player */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[460px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <span className="text-xs font-bold uppercase tracking-wider text-white">
                Previsualización de Vídeo
              </span>
              <span className="text-xs text-neutral-400">
                {format} • {resolution} • {duration}s
              </span>
            </div>

            {/* Video Player Display */}
            <div className="my-6 flex items-center justify-center min-h-[340px] bg-neutral-900/40 rounded-2xl overflow-hidden relative">
              {isGenerating ? (
                <div className="text-center p-8 space-y-4 max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-900 border border-neutral-800 mx-auto flex items-center justify-center">
                    <VideoIcon className="w-6 h-6 text-white animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Renderizando vídeo</h4>
                    <p className="text-xs text-neutral-400 mt-1">{generationStep}</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                    <div
                      className="h-full bg-white transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-white">{progress}%</span>
                </div>
              ) : generatedVideoUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <video
                    src={generatedVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="max-h-[360px] w-auto rounded-xl object-contain shadow-2xl"
                  />
                </div>
              ) : (
                <div className="relative group cursor-pointer" onClick={handleStartGeneration}>
                  <img
                    src={uploadedImage}
                    alt="Frame preview"
                    className="max-h-[340px] w-auto rounded-xl object-contain opacity-70 group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/90 text-black flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-neutral-400">
              {generatedVideoUrl ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Vídeo generado y listo para post-producción
                </span>
              ) : (
                <span>Pulsa «Generar Vídeo» para comenzar la síntesis neuronal.</span>
              )}
            </div>

            {generatedVideoUrl && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleSaveToLibrary}
                  className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold transition-colors"
                >
                  Guardar en Biblioteca
                </button>
                <button
                  onClick={handleSendToStudio}
                  className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
                >
                  <Film className="w-4 h-4" />
                  <span>Editar en Estudio</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
