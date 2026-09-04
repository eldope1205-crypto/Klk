import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { Scene, ToolId } from "../../types";
import {
  Sparkles,
  Sliders,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Film,
  Image,
  Video,
  Music,
  FileText,
  Layers,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit3,
} from "lucide-react";

export const DirectorIA: React.FC = () => {
  const {
    createProject,
    spendPoints,
    addHistoryItem,
    addNotification,
    setActiveView,
    sendAssetToTool,
  } = useApp();

  const [mode, setMode] = useState<"automatico" | "manual">("automatico");
  const [ideaPrompt, setIdeaPrompt] = useState(
    "Créame un vídeo de 60 segundos sobre curiosidades del universo para TikTok, vertical 9:16, con imágenes realistas, movimiento cinematográfico, voz en español, música y subtítulos."
  );

  const [format, setFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [duration, setDuration] = useState<number>(60);
  const [style, setStyle] = useState("Cinematográfico");
  const [voice, setVoice] = useState("Elena (Español Neutro)");

  // Pipeline states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [productionProgress, setProductionProgress] = useState(0);
  const [generatedPlan, setGeneratedPlan] = useState<any | null>(null);
  const [generatedScenes, setGeneratedScenes] = useState<Scene[]>([]);
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null);

  const pipelineSteps = [
    { key: "idea", label: "Interpretando idea y parámetros" },
    { key: "plan", label: "Preparando plan de producción" },
    { key: "guion", label: "Creando guión cinematográfico" },
    { key: "escenas", label: "Dividiendo y estructurando escenas" },
    { key: "imagenes", label: "Preparando imágenes cinematográficas" },
    { key: "video", label: "Generando movimiento (Imagen a Vídeo)" },
    { key: "voz", label: "Sintetizando locución de voz" },
    { key: "musica", label: "Añadiendo música y texturas de fondo" },
    { key: "subtitulos", label: "Creando y sincronizando subtítulos" },
    { key: "edicion", label: "Montando vídeo en el motor central" },
    { key: "resultado", label: "Proyecto terminado con éxito" },
  ];

  // Pipeline execution effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && !isPaused && currentStepIndex < pipelineSteps.length - 1) {
      timer = setTimeout(() => {
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        setProductionProgress(Math.round(((nextIndex + 1) / pipelineSteps.length) * 100));

        if (nextIndex === pipelineSteps.length - 1) {
          setIsRunning(false);
          addNotification({
            title: "Director IA: Producción completada",
            message: "Tu proyecto ha sido producido y montado automáticamente.",
            type: "success",
            actionTool: "estudio_video",
          });
        }
      }, 1400);
    }
    return () => clearTimeout(timer);
  }, [isRunning, isPaused, currentStepIndex, pipelineSteps.length]);

  const handleStartProduction = async () => {
    if (!ideaPrompt.trim()) return;

    if (!spendPoints(85, "Director IA: Plan automático completo")) {
      return;
    }

    setIsRunning(true);
    setIsPaused(false);
    setCurrentStepIndex(0);
    setProductionProgress(5);

    try {
      // Call server backend to generate real production plan
      const res = await fetch("/api/ai/director/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: ideaPrompt,
          duration,
          format,
          style,
        }),
      });

      const data = await res.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
        const scenes: Scene[] = (data.plan.scenes || []).map((sc: any, idx: number) => ({
          id: "sc_" + Date.now() + "_" + idx,
          number: sc.number || idx + 1,
          time: sc.time || `${idx * 15}:00 - ${(idx + 1) * 15}:00`,
          title: sc.title || `Escena ${idx + 1}`,
          description: sc.description || "",
          imagePrompt: sc.imagePrompt || "Cinematic 8k visual",
          imageUrl: [
            "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&auto=format&fit=crop&q=80",
            "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
          ][idx % 4],
          voiceover: sc.voiceover || "",
          cameraMotion: sc.cameraMotion || "Zoom in suave con paneo",
          soundEffect: sc.soundEffect || "Textura ambiental",
          durationSeconds: Math.floor(duration / 4),
          status: "ready",
        }));
        setGeneratedScenes(scenes);
        setSelectedScene(scenes[0]);

        // Automatically create project in user context
        createProject({
          name: data.plan.title || "Producción Director IA",
          description: ideaPrompt,
          category: "director",
          format,
          durationSeconds: duration,
          scenes,
          voice,
          progress: 85,
        });

        addHistoryItem({
          title: `Director IA: ${data.plan.title || "Vídeo"}`,
          tool: "Director IA",
          type: "director",
          pointsCost: 85,
          status: "completado",
          details: `Vídeo ${format} de ${duration}s generado automáticamente`,
        });
      }
    } catch (err) {
      console.warn("Backend plan generation error, continuing client pipeline:", err);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleSendToVideoStudio = () => {
    sendAssetToTool("estudio_video", {
      title: generatedPlan?.title || "Proyecto Director IA",
      format,
      scenes: generatedScenes,
    });
  };

  const quickIdeas = [
    "Curiosidades del universo para TikTok 9:16 con voz cinematográfica",
    "Comercial futurista de zapatillas urbanas estilo Cyberpunk",
    "3 secretos estoicos para dominar la concentración y productividad",
    "El misterio sin resolver de la biblioteca perdida de Alejandría",
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-8 animate-in fade-in">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-wide">DIRECTOR IA</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white text-black">
                El Cerebro
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Automatiza la producción audiovisual completa desde una sola idea.
            </p>
          </div>
        </div>

        {/* Mode Switcher: AUTOMÁTICO / MANUAL */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800 self-start sm:self-auto">
          <button
            onClick={() => setMode("automatico")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "automatico"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            MODO AUTOMÁTICO
          </button>
          <button
            onClick={() => setMode("manual")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              mode === "manual"
                ? "bg-white text-black shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            MODO MANUAL
          </button>
        </div>
      </div>

      {mode === "manual" ? (
        /* MODO MANUAL */
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 text-xs text-neutral-300 flex items-center gap-3">
            <Sliders className="w-5 h-5 text-white shrink-0" />
            <div>
              <strong className="text-white">Modo Manual Activado:</strong> Selecciona cualquier
              herramienta individualmente para crear tu contenido paso a paso sin la automatización
              del Director IA.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                id: "imagen",
                title: "Imagen IA",
                desc: "Genera imágenes y elimina fondos",
                icon: <Image className="w-5 h-5 text-white" />,
              },
              {
                id: "video",
                title: "Vídeo IA",
                desc: "Texto/Foto/Imagen a vídeo",
                icon: <Video className="w-5 h-5 text-white" />,
              },
              {
                id: "audio",
                title: "Audio IA",
                desc: "Texto a voz y efectos",
                icon: <Music className="w-5 h-5 text-white" />,
              },
              {
                id: "editor",
                title: "Editor IA",
                desc: "Mejora vídeos e imágenes",
                icon: <Sliders className="w-5 h-5 text-white" />,
              },
              {
                id: "estudio_video",
                title: "Estudio de Vídeo IA",
                desc: "Editor multipista profesional",
                icon: <Film className="w-5 h-5 text-white" />,
              },
              {
                id: "estudio_visual",
                title: "Estudio Visual IA",
                desc: "Lienzo de diseño y capas",
                icon: <Layers className="w-5 h-5 text-white" />,
              },
              {
                id: "laboratorio_audio",
                title: "Laboratorio de Audio",
                desc: "Mezclador multipista sonoro",
                icon: <Music className="w-5 h-5 text-white" />,
              },
              {
                id: "contenido",
                title: "Generador de Contenido",
                desc: "Guiones y textos para redes",
                icon: <FileText className="w-5 h-5 text-white" />,
              },
            ].map((tool) => (
              <div
                key={tool.id}
                onClick={() => setActiveView(tool.id as ToolId)}
                className="group p-5 rounded-2xl bg-neutral-950 border border-neutral-850 hover:border-neutral-700 hover:bg-neutral-900/60 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 w-fit mb-3">
                    {tool.icon}
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-neutral-200">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">{tool.desc}</p>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs font-semibold text-neutral-400 group-hover:text-white">
                  <span>Abrir herramienta</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* MODO AUTOMÁTICO */
        <div className="space-y-6">
          {/* Main Idea Input Card */}
          <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
                Escribe tu idea o petición para el Director IA
              </label>
              <textarea
                rows={3}
                value={ideaPrompt}
                onChange={(e) => setIdeaPrompt(e.target.value)}
                placeholder="Ejemplo: Créame un vídeo de 60 segundos sobre curiosidades del universo para TikTok, vertical 9:16..."
                className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-white/20 transition-all resize-none"
              />
            </div>

            {/* Quick Inspiration Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="text-[11px] text-neutral-500 self-center">Ideas rápidas:</span>
              {quickIdeas.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => setIdeaPrompt(idea)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-neutral-300 hover:text-white transition-colors text-left truncate max-w-xs"
                >
                  {idea}
                </button>
              ))}
            </div>

            {/* Controls Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-900">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Formato
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="9:16">9:16 (TikTok, Shorts, Reels)</option>
                  <option value="16:9">16:9 (YouTube, Cine)</option>
                  <option value="1:1">1:1 (Instagram Feed)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Duración
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value={15}>15 segundos</option>
                  <option value={30}>30 segundos</option>
                  <option value={60}>60 segundos (Recomendado)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Estilo
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="Cinematográfico">Cinematográfico 8K</option>
                  <option value="Hiperrealista">Hiperrealista</option>
                  <option value="Anime Estilizado">Anime Estilizado</option>
                  <option value="3D Pixar">3D Animación</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Voz en off
                </label>
                <select
                  value={voice}
                  onChange={(e) => setVoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-semibold text-white focus:outline-none"
                >
                  <option value="Elena (Español Neutro)">Elena (Español Neutro)</option>
                  <option value="Carlos (Voz Grave Cinematográfica)">Carlos (Voz Grave)</option>
                  <option value="Mateo (Joven Dinámico)">Mateo (Joven Dinámico)</option>
                  <option value="Sofia (Suave y Serena)">Sofia (Suave y Serena)</option>
                </select>
              </div>
            </div>

            {/* Start Production Button */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                <span className="text-amber-400">⚡</span>
                <span>Coste: 85 puntos (incluye guión, escenas, audio y montaje)</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isRunning ? (
                  <>
                    <button
                      onClick={() => setIsPaused(!isPaused)}
                      className="px-4 py-3 rounded-xl bg-neutral-800 text-white font-bold text-xs flex items-center gap-2 hover:bg-neutral-700 transition-colors"
                    >
                      {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                      <span>{isPaused ? "Reanudar" : "Pausar"}</span>
                    </button>
                    <button
                      onClick={handleStop}
                      className="px-4 py-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 font-bold text-xs flex items-center gap-2 hover:bg-red-900 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Detener</span>
                    </button>
                  </>
                ) : (
                  <button
                    id="director-start-btn"
                    onClick={handleStartProduction}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Iniciar Dirección Automática</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pipeline Progress Monitor */}
          {(isRunning || currentStepIndex >= 0) && (
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white tracking-wider uppercase flex items-center gap-2">
                    <span>Progreso de la Dirección</span>
                    {isRunning && (
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {pipelineSteps[currentStepIndex]?.label || "Completado"}
                  </p>
                </div>
                <span className="text-lg font-black text-white">{productionProgress}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-800">
                <div
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${productionProgress}%` }}
                />
              </div>

              {/* Visual Step Pipeline: IDEA ↓ PLAN ↓ GUION ↓ ESCENAS ↓ IMÁGENES ↓ IMAGEN A VÍDEO ↓ VOZ ↓ MÚSICA ↓ SUBTÍTULOS ↓ EDICIÓN ↓ RESULTADO */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {pipelineSteps.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`p-2.5 rounded-xl border text-[11px] transition-all flex items-center gap-2 ${
                        isDone
                          ? "bg-neutral-900 border-neutral-750 text-neutral-200"
                          : isCurrent
                          ? "bg-white text-black font-bold border-white shadow-md scale-[1.02]"
                          : "bg-neutral-950/60 border-neutral-850 text-neutral-500"
                      }`}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <span className="text-[10px] text-neutral-600 font-bold">{idx + 1}</span>
                        )}
                      </div>
                      <span className="truncate">{step.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Generated Result & Scenes Preview */}
          {generatedScenes.length > 0 && (
            <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
                <div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Producción Lista
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">
                    {generatedPlan?.title || "Resultado del Director IA"}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {generatedPlan?.summary || `${generatedScenes.length} escenas estructuradas y listas para edición.`}
                  </p>
                </div>

                {/* Primary Action: Send to Video Studio */}
                <button
                  id="director-send-to-studio-btn"
                  onClick={handleSendToVideoStudio}
                  className="px-5 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <Film className="w-4 h-4" />
                  <span>Abrir en Estudio de Vídeo IA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scenes Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {generatedScenes.map((scene) => (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      selectedScene?.id === scene.id
                        ? "bg-neutral-900 border-neutral-600 shadow-lg"
                        : "bg-neutral-900/40 border-neutral-850 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Image Thumbnail */}
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0">
                        <img
                          src={scene.imageUrl}
                          alt={scene.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/80 text-white">
                          {scene.time}
                        </span>
                      </div>

                      {/* Scene details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">
                            Escena {scene.number}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-semibold">
                            {scene.durationSeconds}s
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-0.5 truncate">
                          {scene.title}
                        </h4>
                        <p className="text-xs text-neutral-400 mt-1 line-clamp-2 italic">
                          «{scene.voiceover}»
                        </p>
                        <div className="mt-2 text-[10px] text-neutral-500 truncate">
                          <strong>Cámara:</strong> {scene.cameraMotion}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Selected Scene Detail & Reviewer */}
              {selectedScene && (
                <div className="p-4 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-white uppercase tracking-wider">
                    <span>Revisión de Escena #{selectedScene.number}: {selectedScene.title}</span>
                    <span className="text-neutral-400">{selectedScene.time}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                      <span className="text-[10px] font-bold uppercase text-neutral-500">
                        Guión de voz en off
                      </span>
                      <p className="text-white mt-1 leading-relaxed">
                        {selectedScene.voiceover}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-850">
                      <span className="text-[10px] font-bold uppercase text-neutral-500">
                        Prompt de imagen cinematográfica
                      </span>
                      <p className="text-neutral-300 mt-1 font-mono text-[11px] leading-relaxed">
                        {selectedScene.imagePrompt}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
