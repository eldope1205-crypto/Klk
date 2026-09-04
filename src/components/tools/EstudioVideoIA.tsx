import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../../context/AppContext";
import {
  Play,
  Pause,
  Scissors,
  Copy,
  Trash2,
  Plus,
  Volume2,
  VolumeX,
  Download,
  Upload,
  Maximize2,
  RotateCcw,
  Sparkles,
  Type,
  Music,
  Mic,
  Video as VideoIcon,
  Film,
  CheckCircle,
} from "lucide-react";

interface TimelineClip {
  id: string;
  name: string;
  type: "video" | "text" | "voice" | "music";
  startTime: number;
  duration: number;
  thumbnail?: string;
  content?: string;
  volume?: number;
}

export const EstudioVideoIA: React.FC = () => {
  const { sharedAsset, clearSharedAsset, addLibraryItem, addNotification, activeProject } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(15);
  const [format, setFormat] = useState<"9:16" | "16:9" | "1:1">("9:16");
  const [resolution, setResolution] = useState<"720p" | "1080p">("1080p");
  const [selectedClipId, setSelectedClipId] = useState<string | null>("v1");
  const [isMuted, setIsMuted] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Timeline Clips
  const [videoClips, setVideoClips] = useState<TimelineClip[]>([
    {
      id: "v1",
      name: "Escena 1: Introducción Cósmica",
      type: "video",
      startTime: 0,
      duration: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "v2",
      name: "Escena 2: Partículas y Luz",
      type: "video",
      startTime: 5,
      duration: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=400&auto=format&fit=crop&q=80",
    },
    {
      id: "v3",
      name: "Escena 3: Revelación Final",
      type: "video",
      startTime: 10,
      duration: 5,
      thumbnail:
        "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&auto=format&fit=crop&q=80",
    },
  ]);

  const [textClips, setTextClips] = useState<TimelineClip[]>([
    {
      id: "t1",
      name: "Subtítulo 1",
      type: "text",
      startTime: 0,
      duration: 5,
      content: "¿Sabías que el 95% del universo es energía oscura?",
    },
    {
      id: "t2",
      name: "Subtítulo 2",
      type: "text",
      startTime: 5,
      duration: 5,
      content: "Las distancias desafían cualquier escala conocida.",
    },
    {
      id: "t3",
      name: "Subtítulo 3",
      type: "text",
      startTime: 10,
      duration: 5,
      content: "GREY IA — Producción Cinematográfica.",
    },
  ]);

  const [voiceClips, setVoiceClips] = useState<TimelineClip[]>([
    {
      id: "vo1",
      name: "Locución Elena (00:00 - 00:15)",
      type: "voice",
      startTime: 0,
      duration: 15,
      volume: 100,
    },
  ]);

  const [musicClips, setMusicClips] = useState<TimelineClip[]>([
    {
      id: "m1",
      name: "Banda Sonora 'Ecos del Espacio'",
      type: "music",
      startTime: 0,
      duration: 15,
      volume: 65,
    },
  ]);

  // Handle asset passed from Director IA or Video IA
  useEffect(() => {
    if (sharedAsset?.toolId === "estudio_video") {
      if (sharedAsset.assetData?.format) {
        setFormat(sharedAsset.assetData.format);
      }
      if (sharedAsset.assetData?.scenes) {
        const newVClips: TimelineClip[] = sharedAsset.assetData.scenes.map((sc: any, idx: number) => ({
          id: "v_sc_" + idx,
          name: sc.title || `Escena ${idx + 1}`,
          type: "video",
          startTime: idx * 5,
          duration: sc.durationSeconds || 5,
          thumbnail: sc.imageUrl,
        }));
        setVideoClips(newVClips);
        setTotalDuration(newVClips.length * 5);
      }
      clearSharedAsset();
    }
  }, [sharedAsset]);

  // Playback timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          return Number((prev + 0.1).toFixed(1));
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  // Current active video clip
  const currentVideoClip =
    videoClips.find((c) => currentTime >= c.startTime && currentTime < c.startTime + c.duration) ||
    videoClips[0];

  // Current active subtitle
  const currentSubtitle = textClips.find(
    (c) => currentTime >= c.startTime && currentTime < c.startTime + c.duration
  );

  const handleSplitClip = () => {
    if (!selectedClipId) return;
    const clip = videoClips.find((c) => c.id === selectedClipId);
    if (!clip || clip.duration <= 2) return;

    const half = Math.floor(clip.duration / 2);
    const updated = videoClips.map((c) => (c.id === clip.id ? { ...c, duration: half } : c));
    const newClip: TimelineClip = {
      ...clip,
      id: "v_split_" + Date.now(),
      name: `${clip.name} (Parte 2)`,
      startTime: clip.startTime + half,
      duration: clip.duration - half,
    };
    setVideoClips([...updated, newClip]);
  };

  const handleDuplicateClip = () => {
    if (!selectedClipId) return;
    const clip = videoClips.find((c) => c.id === selectedClipId);
    if (!clip) return;
    const dup: TimelineClip = {
      ...clip,
      id: "v_dup_" + Date.now(),
      name: `${clip.name} (Copia)`,
      startTime: totalDuration,
    };
    setVideoClips([...videoClips, dup]);
    setTotalDuration((prev) => prev + clip.duration);
  };

  const handleDeleteClip = () => {
    if (!selectedClipId || videoClips.length <= 1) return;
    setVideoClips(videoClips.filter((c) => c.id !== selectedClipId));
    setSelectedClipId(videoClips[0]?.id || null);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);

    const interval = setInterval(() => {
      setExportProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            addLibraryItem({
              title: `Vídeo Exportado (${format}, ${resolution})`,
              type: "video",
              url: currentVideoClip?.thumbnail || "",
              category: "Estudio de Vídeo IA",
            });
            addNotification({
              title: "Exportación finalizada",
              message: `Vídeo en formato ${format} listo para descargar.`,
              type: "success",
            });
          }, 600);
          return 100;
        }
        return p + 20;
      });
    }, 400);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              ESTUDIO DE VÍDEO IA
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Línea de tiempo multipista, corte de clips, subtítulos, audio y exportación.
            </p>
          </div>
        </div>

        {/* Controls & Export */}
        <div className="flex items-center gap-2">
          {/* Format selector */}
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white focus:outline-none"
          >
            <option value="9:16">9:16 (TikTok / Shorts)</option>
            <option value="16:9">16:9 (YouTube)</option>
            <option value="1:1">1:1 (Cuadrado)</option>
          </select>

          {/* Resolution */}
          <select
            value={resolution}
            onChange={(e) => setResolution(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-bold text-white focus:outline-none"
          >
            <option value="1080p">1080p FHD</option>
            <option value="720p">720p HD</option>
          </select>

          {/* Export Button */}
          <button
            id="studio-export-btn"
            onClick={handleExport}
            disabled={isExporting}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? `Exportando ${exportProgress}%` : "Exportar Vídeo"}</span>
          </button>
        </div>
      </div>

      {/* Main Preview Stage Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Video Monitor Screen */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-850 rounded-3xl p-6 flex flex-col items-center justify-between shadow-xl">
          {/* Video Frame */}
          <div
            className={`relative flex items-center justify-center bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 transition-all ${
              format === "9:16"
                ? "w-64 h-[440px]"
                : format === "16:9"
                ? "w-full max-w-lg aspect-video"
                : "w-80 h-80"
            }`}
          >
            {currentVideoClip?.thumbnail && (
              <img
                src={currentVideoClip.thumbnail}
                alt="Vídeo monitor"
                className="w-full h-full object-cover"
              />
            )}

            {/* Subtitle Display */}
            {currentSubtitle && (
              <div className="absolute inset-x-4 bottom-8 text-center pointer-events-none">
                <span className="inline-block px-3 py-1.5 rounded-lg bg-black/75 text-white font-extrabold text-xs sm:text-sm tracking-wide backdrop-blur-sm border border-white/10 shadow-lg">
                  {currentSubtitle.content}
                </span>
              </div>
            )}

            {/* Timecode Badge */}
            <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
              00:{currentTime < 10 ? `0${Math.floor(currentTime)}` : Math.floor(currentTime)} / 00:
              {totalDuration}
            </span>
          </div>

          {/* Transport Controls Bar */}
          <div className="w-full mt-4 pt-4 border-t border-neutral-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                title="Volver al inicio"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Timeline scrubber indicator */}
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
              <span className="text-white font-bold">{currentTime}s</span> / {totalDuration}s
            </div>
          </div>
        </div>

        {/* Right: Clip Inspector & Quick Tools */}
        <div className="lg:col-span-4 bg-neutral-950 border border-neutral-850 rounded-3xl p-5 space-y-4 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-900">
            Inspector de Clip
          </h3>

          {selectedClipId ? (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Clip Seleccionado</span>
                <div className="text-sm font-bold text-white mt-0.5">
                  {videoClips.find((c) => c.id === selectedClipId)?.name || "Clip"}
                </div>
              </div>

              {/* Clip Actions */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={handleSplitClip}
                  className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <Scissors className="w-4 h-4" />
                  <span>Dividir</span>
                </button>
                <button
                  onClick={handleDuplicateClip}
                  className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Duplicar</span>
                </button>
                <button
                  onClick={handleDeleteClip}
                  className="p-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-red-400 flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Eliminar</span>
                </button>
              </div>

              {/* Adjust Duration */}
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  Duración del clip (segundos)
                </label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={videoClips.find((c) => c.id === selectedClipId)?.duration || 5}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setVideoClips(
                      videoClips.map((c) => (c.id === selectedClipId ? { ...c, duration: val } : c))
                    );
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-neutral-500 text-xs">
              Selecciona un clip en la línea de tiempo para ajustar sus propiedades.
            </div>
          )}
        </div>
      </div>

      {/* Multi-track Timeline Section */}
      <div className="bg-neutral-950 border border-neutral-850 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-white">
              Línea de Tiempo Multipista
            </span>
            <span className="text-[10px] text-neutral-500">4 pistas sincronizadas</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newSubtitle: TimelineClip = {
                  id: "t_" + Date.now(),
                  name: `Subtítulo ${textClips.length + 1}`,
                  type: "text",
                  startTime: currentTime,
                  duration: 4,
                  content: "Nuevo subtítulo sincronizado...",
                };
                setTextClips([...textClips, newSubtitle]);
              }}
              className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <Type className="w-3.5 h-3.5" />
              <span>+ Subtítulo</span>
            </button>
          </div>
        </div>

        {/* Tracks View */}
        <div className="space-y-3 select-none">
          {/* Track 1: Video Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <VideoIcon className="w-3.5 h-3.5" />
              <span>Vídeo</span>
            </div>
            <div className="flex-1 bg-neutral-900/60 rounded-xl p-1.5 flex gap-2 overflow-x-auto">
              {videoClips.map((clip) => (
                <div
                  key={clip.id}
                  onClick={() => setSelectedClipId(clip.id)}
                  style={{ flexGrow: clip.duration }}
                  className={`relative h-16 min-w-[120px] rounded-lg overflow-hidden border cursor-pointer transition-all flex items-end p-2 ${
                    selectedClipId === clip.id
                      ? "border-white shadow-lg ring-1 ring-white/50"
                      : "border-neutral-800 hover:border-neutral-600 opacity-80"
                  }`}
                >
                  {clip.thumbnail && (
                    <img
                      src={clip.thumbnail}
                      alt={clip.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-60"
                    />
                  )}
                  <div className="relative z-10 text-[10px] font-bold text-white truncate bg-black/60 px-1.5 py-0.5 rounded">
                    {clip.name} ({clip.duration}s)
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Track 2: Text / Subtitles Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              <span>Texto</span>
            </div>
            <div className="flex-1 bg-neutral-900/40 rounded-xl p-1.5 flex gap-2 overflow-x-auto">
              {textClips.map((clip) => (
                <div
                  key={clip.id}
                  style={{ flexGrow: clip.duration }}
                  className="h-9 min-w-[100px] rounded-lg bg-neutral-850 border border-neutral-750 px-2.5 flex items-center text-[10px] font-semibold text-neutral-200 truncate"
                >
                  «{clip.content}»
                </div>
              ))}
            </div>
          </div>

          {/* Track 3: Voiceover Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              <span>Voz</span>
            </div>
            <div className="flex-1 bg-neutral-900/40 rounded-xl p-1.5 flex gap-2">
              {voiceClips.map((clip) => (
                <div
                  key={clip.id}
                  className="w-full h-9 rounded-lg bg-neutral-800/80 border border-neutral-700 px-3 flex items-center justify-between text-[11px] font-medium text-white"
                >
                  <span>{clip.name}</span>
                  <span className="text-[10px] text-neutral-400">Volumen: {clip.volume}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Track 4: Music Track */}
          <div className="flex items-center gap-3">
            <div className="w-24 shrink-0 text-xs font-bold text-neutral-400 flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5" />
              <span>Música</span>
            </div>
            <div className="flex-1 bg-neutral-900/40 rounded-xl p-1.5 flex gap-2">
              {musicClips.map((clip) => (
                <div
                  key={clip.id}
                  className="w-full h-9 rounded-lg bg-neutral-850/80 border border-neutral-750 px-3 flex items-center justify-between text-[11px] font-medium text-neutral-300"
                >
                  <span>{clip.name}</span>
                  <span className="text-[10px] text-neutral-400">Volumen: {clip.volume}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
