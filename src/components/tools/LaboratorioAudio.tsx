import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Sliders,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Scissors,
  Copy,
  Trash2,
  Download,
  Plus,
  Mic,
  Music,
  Radio,
} from "lucide-react";

interface AudioTrackItem {
  id: string;
  name: string;
  type: "voz" | "musica" | "efectos";
  startTime: number;
  duration: number;
  volume: number;
  color: string;
}

export const LaboratorioAudio: React.FC = () => {
  const { addLibraryItem, addNotification, sharedAsset, clearSharedAsset } = useApp();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const totalDuration = 30;

  const [tracks, setTracks] = useState<AudioTrackItem[]>([
    {
      id: "a1",
      name: "Locución Elena - Capítulo 1",
      type: "voz",
      startTime: 0,
      duration: 15,
      volume: 90,
      color: "bg-neutral-800 border-neutral-700",
    },
    {
      id: "a2",
      name: "Sinfonía Cósmica (Synthwave)",
      type: "musica",
      startTime: 0,
      duration: 30,
      volume: 60,
      color: "bg-neutral-850 border-neutral-750",
    },
    {
      id: "a3",
      name: "Impacto Sub-Bajo Espacial",
      type: "efectos",
      startTime: 14,
      duration: 6,
      volume: 75,
      color: "bg-neutral-900 border-neutral-800",
    },
  ]);

  const [selectedId, setSelectedId] = useState<string>("a1");

  useEffect(() => {
    if (sharedAsset?.toolId === "laboratorio_audio") {
      const newItem: AudioTrackItem = {
        id: "a_imp_" + Date.now(),
        name: sharedAsset.assetData?.trackName || "Nueva Pista Audio",
        type: (sharedAsset.assetData?.type as any) || "musica",
        startTime: currentTime,
        duration: 12,
        volume: 80,
        color: "bg-neutral-800 border-neutral-700",
      };
      setTracks((prev) => [...prev, newItem]);
      setSelectedId(newItem.id);
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
          return Number((prev + 0.2).toFixed(1));
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration]);

  const selectedTrack = tracks.find((t) => t.id === selectedId);

  const handleDuplicate = () => {
    if (!selectedTrack) return;
    const dup: AudioTrackItem = {
      ...selectedTrack,
      id: "dup_" + Date.now(),
      name: `${selectedTrack.name} (Copia)`,
      startTime: Math.min(totalDuration - 5, selectedTrack.startTime + 5),
    };
    setTracks([...tracks, dup]);
  };

  const handleDelete = () => {
    if (!selectedId || tracks.length <= 1) return;
    setTracks(tracks.filter((t) => t.id !== selectedId));
    setSelectedId(tracks[0]?.id || "");
  };

  const handleExport = () => {
    addLibraryItem({
      title: "Mezcla Master de Audio (WAV 24-bit)",
      type: "audio",
      url: "",
      category: "Laboratorio de Audio",
    });
    addNotification({
      title: "Audio exportado",
      message: "Tu mezcla de audio estéreo se ha guardado en la biblioteca.",
      type: "success",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              LABORATORIO DE AUDIO
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Mezclador multipista, balance de volumen de voces, música de fondo y efectos.
            </p>
          </div>
        </div>

        <button
          id="export-audio-lab-btn"
          onClick={handleExport}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Audio (WAV)</span>
        </button>
      </div>

      {/* Main Transport and Controls Bar */}
      <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setCurrentTime(0);
            }}
            className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
            title="Volver al inicio"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <div className="text-xs font-mono text-neutral-400 ml-2">
            Tiempo: <span className="text-white font-bold">{currentTime}s</span> / {totalDuration}s
          </div>
        </div>

        {/* Selected track action buttons */}
        {selectedTrack && (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
              <Volume2 className="w-4 h-4 text-neutral-400" />
              <span className="text-neutral-400 font-medium">Volumen:</span>
              <span className="text-white font-bold">{selectedTrack.volume}%</span>
              <input
                type="range"
                min={0}
                max={100}
                value={selectedTrack.volume}
                onChange={(e) => {
                  const v = Number(e.target.value);
                  setTracks(
                    tracks.map((t) => (t.id === selectedTrack.id ? { ...t, volume: v } : t))
                  );
                }}
                className="w-20 accent-white ml-1"
              />
            </div>

            <button
              onClick={handleDuplicate}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white"
              title="Duplicar pista"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-red-400 hover:text-red-300"
              title="Eliminar pista"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Multi-track Timeline */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
          <span className="text-xs font-extrabold uppercase tracking-wider text-white">
            Pistas de Sonido Sincronizadas
          </span>
          <span className="text-[10px] text-neutral-500">Haz clic en una pista para seleccionarla</span>
        </div>

        {/* Time ruler */}
        <div className="flex pl-24 pr-4 justify-between text-[10px] text-neutral-500 font-mono select-none">
          <span>00:00</span>
          <span>00:05</span>
          <span>00:10</span>
          <span>00:15</span>
          <span>00:20</span>
          <span>00:25</span>
          <span>00:30</span>
        </div>

        {/* Tracks List */}
        <div className="space-y-3 select-none">
          {tracks.map((t) => {
            const isSelected = selectedId === t.id;
            const leftPercent = (t.startTime / totalDuration) * 100;
            const widthPercent = (t.duration / totalDuration) * 100;

            const iconMap = {
              voz: <Mic className="w-3.5 h-3.5" />,
              musica: <Music className="w-3.5 h-3.5" />,
              efectos: <Radio className="w-3.5 h-3.5" />,
            };

            return (
              <div key={t.id} className="flex items-center gap-3">
                <div className="w-24 shrink-0 text-xs font-bold text-neutral-400 flex items-center gap-1.5 truncate">
                  {iconMap[t.type]}
                  <span className="capitalize">{t.type}</span>
                </div>

                <div className="flex-1 bg-neutral-900/40 rounded-xl h-14 p-1 relative overflow-hidden border border-neutral-850">
                  <div
                    onClick={() => setSelectedId(t.id)}
                    style={{
                      left: `${leftPercent}%`,
                      width: `${widthPercent}%`,
                    }}
                    className={`absolute top-1 bottom-1 rounded-lg border p-2 flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white text-black font-bold border-white shadow-lg"
                        : "bg-neutral-800/80 border-neutral-700 text-neutral-200 hover:bg-neutral-750"
                    }`}
                  >
                    <span className="text-xs truncate">{t.name}</span>
                    <span className="text-[10px] ml-2 opacity-75">{t.duration}s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
