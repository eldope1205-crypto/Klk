import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Music,
  Mic,
  Sparkles,
  Play,
  Pause,
  Download,
  Bookmark,
  PlusCircle,
  Volume2,
  Sliders,
  Radio,
} from "lucide-react";

export const AudioIA: React.FC = () => {
  const {
    spendPoints,
    addHistoryItem,
    addLibraryItem,
    sendAssetToTool,
    addNotification,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"voz" | "musica" | "efectos">("voz");

  // Voz state
  const [voiceText, setVoiceText] = useState(
    "El universo no está obligado a tener sentido para nosotros. Sin embargo, cada estrella cuenta la historia de nuestro origen cósmico."
  );
  const [selectedVoice, setSelectedVoice] = useState("Elena (Español Neutro)");
  const [voiceSpeed, setVoiceSpeed] = useState(1);
  const [voicePitch, setVoicePitch] = useState(1);

  // Música state
  const [musicPrompt, setMusicPrompt] = useState(
    "Banda sonora cinemática espacial con sintetizadores profundos, piano melancólico y crescendo orquestal"
  );
  const [musicDuration, setMusicDuration] = useState(30);
  const [musicGenre, setMusicGenre] = useState("Cinemático / Sci-Fi");

  // Efectos state
  const [sfxPrompt, setSfxPrompt] = useState(
    "Explosión lejana amortiguada en el vacío espacial con eco resonante"
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudioTitle, setGeneratedAudioTitle] = useState<string | null>(null);

  const handleSpeakSpeech = () => {
    if (!voiceText.trim()) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isPlaying) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(voiceText);
      utterance.rate = voiceSpeed;
      utterance.pitch = voicePitch;
      utterance.lang = "es-ES";

      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setGeneratedAudioTitle(`Locución: ${selectedVoice}`);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleGenerateMusic = () => {
    if (!spendPoints(20, "Generación de música IA")) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedAudioTitle(`Música: ${musicGenre} (${musicDuration}s)`);
      addHistoryItem({
        title: `Música: ${musicGenre}`,
        tool: "Audio IA",
        type: "audio",
        pointsCost: 20,
        status: "completado",
      });
      addNotification({
        title: "Pista musical creada",
        message: "Tu banda sonora ha sido sintetizada con éxito.",
        type: "success",
      });
    }, 1500);
  };

  const handleSendToAudioLab = () => {
    sendAssetToTool("laboratorio_audio", {
      trackName: generatedAudioTitle || "Pista Audio IA",
      type: activeTab,
    });
  };

  const handleSaveToLibrary = () => {
    addLibraryItem({
      title: generatedAudioTitle || "Audio IA",
      type: "audio",
      url: "",
      category: "Audio IA",
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">AUDIO IA</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Generación de locución ultranatural, bandas sonoras cinematográficas y efectos de sonido.
            </p>
          </div>
        </div>

        <button
          id="send-to-audio-lab-btn"
          onClick={handleSendToAudioLab}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-bold text-white flex items-center gap-1.5 transition-colors"
        >
          <Sliders className="w-4 h-4" />
          <span>Abrir en Laboratorio de Audio</span>
        </button>
      </div>

      {/* Tabs: VOZ | MÚSICA | EFECTOS */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { id: "voz", label: "Texto a Voz (Locución)", icon: <Mic className="w-4 h-4" /> },
          { id: "musica", label: "Generar Música", icon: <Music className="w-4 h-4" /> },
          { id: "efectos", label: "Efectos Sonoros (SFX)", icon: <Radio className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.id
                ? "bg-white text-black border-white shadow-md font-extrabold"
                : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {tab.icon}
            <span className="truncate">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Form depending on tab */}
      <div className="bg-neutral-950 border border-neutral-850 rounded-3xl p-6 shadow-xl space-y-5">
        {activeTab === "voz" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Texto para Locución
              </label>
              <textarea
                rows={4}
                value={voiceText}
                onChange={(e) => setVoiceText(e.target.value)}
                placeholder="Escribe el texto que la voz en off leerá..."
                className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white text-xs sm:text-sm focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Voz Neuronal
                </label>
                <select
                  value={selectedVoice}
                  onChange={(e) => setSelectedVoice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                >
                  <option value="Elena (Español Neutro)">Elena (Español Neutro)</option>
                  <option value="Carlos (Grave Cinematográfico)">Carlos (Grave)</option>
                  <option value="Mateo (Joven Dinámico)">Mateo (Joven)</option>
                  <option value="Sofia (Serena y Cálida)">Sofia (Serena)</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  <span>Velocidad</span>
                  <span>{voiceSpeed}x</span>
                </div>
                <input
                  type="range"
                  min={0.7}
                  max={1.5}
                  step={0.1}
                  value={voiceSpeed}
                  onChange={(e) => setVoiceSpeed(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>

              <div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  <span>Tono (Pitch)</span>
                  <span>{voicePitch}x</span>
                </div>
                <input
                  type="range"
                  min={0.8}
                  max={1.3}
                  step={0.1}
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(Number(e.target.value))}
                  className="w-full accent-white"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                id="voice-speak-btn"
                onClick={handleSpeakSpeech}
                className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isPlaying ? "Detener Reproducción" : "Escuchar Voz"}</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === "musica" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Prompt Musical
              </label>
              <textarea
                rows={3}
                value={musicPrompt}
                onChange={(e) => setMusicPrompt(e.target.value)}
                placeholder="Describe el estado de ánimo, instrumentos y estilo de la música..."
                className="w-full p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-neutral-600 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Género / Atmósfera
                </label>
                <select
                  value={musicGenre}
                  onChange={(e) => setMusicGenre(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                >
                  <option value="Cinemático / Sci-Fi">Cinemático / Sci-Fi</option>
                  <option value="Lofi Chill">Lofi Chill Relajante</option>
                  <option value="Epic Trailer">Epic Orquestal Trailer</option>
                  <option value="Cyberpunk Synthwave">Cyberpunk Synthwave</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Duración
                </label>
                <select
                  value={musicDuration}
                  onChange={(e) => setMusicDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                >
                  <option value={15}>15 segundos</option>
                  <option value={30}>30 segundos</option>
                  <option value={60}>60 segundos</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateMusic}
              disabled={isGenerating}
              className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>{isGenerating ? "Sintetizando..." : "Generar Música (20 pts)"}</span>
            </button>
          </div>
        )}

        {activeTab === "efectos" && (
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Efecto de Sonido
              </label>
              <input
                type="text"
                value={sfxPrompt}
                onChange={(e) => setSfxPrompt(e.target.value)}
                placeholder="Ej: Transición whoosh, explosión distante, clic metálico..."
                className="w-full p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                setGeneratedAudioTitle(`Efecto SFX: ${sfxPrompt}`);
                addNotification({
                  title: "Efecto de sonido listo",
                  message: "Efecto sintetizado y listo para agregar.",
                  type: "success",
                });
              }}
              className="px-6 py-3 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>Generar SFX (10 pts)</span>
            </button>
          </div>
        )}

        {/* Audio Player Card if generated */}
        {generatedAudioTitle && (
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{generatedAudioTitle}</h4>
                <span className="text-[10px] text-neutral-400">Audio sintetizado en 48kHz</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveToLibrary}
                className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-750 text-neutral-300 hover:text-white transition-colors"
                title="Guardar en biblioteca"
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={handleSendToAudioLab}
                className="px-3 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200 transition-colors"
              >
                Enviar al Laboratorio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
