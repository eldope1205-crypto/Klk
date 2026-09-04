import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Share2,
  Sliders,
  Send,
  Youtube,
  Film,
  Instagram,
  Facebook,
} from "lucide-react";

export const ContenidoIA: React.FC = () => {
  const { spendPoints, addHistoryItem, addLibraryItem, addNotification } = useApp();

  const [platform, setPlatform] = useState("TikTok");
  const [contentType, setContentType] = useState("Guion");
  const [topic, setTopic] = useState("5 Curiosidades del espacio que parecen ficción");
  const [tone, setTone] = useState("Impactante y Misterioso");
  const [audience, setAudience] = useState("Jóvenes y creadores de contenido");

  const [generatedResult, setGeneratedResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const platforms = [
    { id: "YouTube", label: "YouTube", icon: <Youtube className="w-4 h-4" /> },
    { id: "YouTube Shorts", label: "Shorts", icon: <Film className="w-4 h-4" /> },
    { id: "TikTok", label: "TikTok", icon: <Film className="w-4 h-4" /> },
    { id: "Instagram Reels", label: "Instagram Reels", icon: <Instagram className="w-4 h-4" /> },
    { id: "Facebook", label: "Facebook", icon: <Facebook className="w-4 h-4" /> },
  ];

  const contentTypes = [
    "Ideas y Temas",
    "Guion Completo",
    "Títulos Virales",
    "Descripciones SEO",
    "Hashtags & Etiquetas",
    "Llamadas a la Acción (CTA)",
    "Contenido Multipropósito",
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    if (!spendPoints(15, `Generación de ${contentType} para ${platform}`)) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          type: contentType,
          topic,
          tone,
        }),
      });

      const data = await res.json();
      setGeneratedResult(data.content || "Contenido generado con éxito.");

      addHistoryItem({
        title: `${contentType}: ${topic.slice(0, 30)}`,
        tool: "Generador de Contenido",
        type: "contenido",
        pointsCost: 15,
        status: "completado",
      });
    } catch (err) {
      // Fallback
      setGeneratedResult(
        `### ${contentType.toUpperCase()} — ${platform.toUpperCase()}\n\n**Tema:** ${topic}\n**Tono:** ${tone}\n\n**1. Gancho de Retención Máxima (0-3s):**\n"Detén lo que estás haciendo, porque esto que descubrí sobre ${topic} desafía todo lo que sabemos."\n\n**2. Estructura Principal:**\n- Punto 1: La revelación inicial contraintuitiva.\n- Punto 2: Evidencia visual y dato sorprendente.\n- Punto 3: Consecuencia directa que impacta al espectador.\n\n**3. Llamada a la Acción (CTA):**\n"Guarda este vídeo para recordarlo y síguenos para la segunda parte."\n\n**Hashtags Recomendados:**\n#GreyIA #${platform.replace(/\s+/g, "")} #Curiosidades #CienciaFiccion #Creadores #Viral`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToLibrary = () => {
    if (!generatedResult) return;
    addLibraryItem({
      title: `${contentType} - ${topic.slice(0, 30)}`,
      type: "texto",
      url: "",
      category: platform,
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">
              GENERADOR DE CONTENIDO
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Crea guiones, ganchos virales, títulos, etiquetas y llamadas a la acción para redes sociales.
            </p>
          </div>
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-1.5 font-semibold">
          <span className="text-amber-400">⚡</span>
          <span>15 pts</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Config */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-850 rounded-3xl p-5 space-y-5">
          {/* Platform Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Plataforma
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {platforms.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    platform === p.id
                      ? "bg-white text-black border-white shadow-sm font-bold"
                      : "bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white"
                  }`}
                >
                  {p.icon}
                  <span className="truncate">{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content Type Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Tipo de Contenido
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs font-semibold focus:outline-none focus:border-neutral-600"
            >
              {contentTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Topic / Premise */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Tema o Premisa
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="¿Sobre qué trata el contenido?"
              className="w-full p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs focus:outline-none focus:border-neutral-600 resize-none"
            />
          </div>

          {/* Tone & Audience */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Tono
              </label>
              <input
                type="text"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Audiencia
              </label>
              <input
                type="text"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs"
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="generate-content-btn"
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 fill-current" />
                <span>Generar Contenido</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output Area */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-850 rounded-3xl p-6 flex flex-col justify-between shadow-xl min-h-[420px]">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Resultado Generado
                </span>
                {platform && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {platform}
                  </span>
                )}
              </div>

              {generatedResult && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                    title="Copiar texto"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={handleSaveToLibrary}
                    className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
                    title="Guardar en Biblioteca"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 text-xs sm:text-sm text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
              {generatedResult || (
                <div className="text-center py-20 text-neutral-600 text-xs">
                  Configura los parámetros a la izquierda y pulsa «Generar Contenido» para obtener
                  tu guion optimizado.
                </div>
              )}
            </div>
          </div>

          {generatedResult && (
            <div className="pt-4 mt-6 border-t border-neutral-900 flex items-center justify-between text-xs text-neutral-400">
              <span>{generatedResult.split(/\s+/).length} palabras generadas</span>
              <button
                onClick={handleCopy}
                className="font-bold text-white hover:underline flex items-center gap-1"
              >
                <span>{copied ? "¡Copiado!" : "Copiar todo el contenido"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
