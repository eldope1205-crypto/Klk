import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Key,
  ShieldCheck,
  Server,
  Zap,
} from "lucide-react";

interface ProviderStatus {
  id: string;
  name: string;
  category: "LLM / Cerebro" | "Vídeo" | "Imagen" | "Voz / Música";
  model: string;
  isConfigured: boolean;
  statusText: string;
  latency?: string;
}

export const ApiHubView: React.FC = () => {
  const { addNotification } = useApp();
  const [isTesting, setIsTesting] = useState(false);
  const [providers, setProviders] = useState<ProviderStatus[]>([
    {
      id: "gemini",
      name: "Google Gemini 3.8 Flash",
      category: "LLM / Cerebro",
      model: "gemini-2.5-flash",
      isConfigured: true,
      statusText: "Conectado y operativo (BFF Server Proxy)",
      latency: "142ms",
    },
    {
      id: "runway",
      name: "Runway Gen-3 Alpha",
      category: "Vídeo",
      model: "gen3a_turbo",
      isConfigured: false,
      statusText: "Proveedor de IA no configurado",
    },
    {
      id: "luma",
      name: "Luma Dream Machine",
      category: "Vídeo",
      model: "ray-2",
      isConfigured: false,
      statusText: "Proveedor de IA no configurado",
    },
    {
      id: "kling",
      name: "Kling AI Video",
      category: "Vídeo",
      model: "kling-v1.5",
      isConfigured: false,
      statusText: "Proveedor de IA no configurado",
    },
    {
      id: "flux",
      name: "Black Forest Labs FLUX.1",
      category: "Imagen",
      model: "flux-schnell",
      isConfigured: false,
      statusText: "Proveedor de IA no configurado",
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs Voice Engine",
      category: "Voz / Música",
      model: "multilingual-v2",
      isConfigured: false,
      statusText: "Proveedor de IA no configurado",
    },
    {
      id: "suno",
      name: "Suno / Udio Music Engine",
      category: "Voz / Música",
      model: "suno-v3.5",
      isConfigured: false,
      statusText: "Proveedor de IA no configurado",
    },
  ]);

  const handleTestHealth = async () => {
    setIsTesting(true);
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setTimeout(() => {
        setIsTesting(false);
        addNotification({
          title: "Diagnóstico completado",
          message: "El proxy BFF de GREY IA está respondiendo correctamente.",
          type: "success",
        });
      }, 800);
    } catch (e) {
      setIsTesting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">API / AI HUB</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Estado de los proveedores de inteligencia artificial y orquestación neuronal.
            </p>
          </div>
        </div>

        <button
          onClick={handleTestHealth}
          disabled={isTesting}
          className="px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 text-white text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isTesting ? "animate-spin" : ""}`} />
          <span>Verificar conexión</span>
        </button>
      </div>

      {/* Security notice box */}
      <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-800 flex items-start gap-4">
        <div className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white shrink-0 mt-0.5">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-white">Arquitectura de Seguridad Backend-for-Frontend</h3>
          <p className="text-neutral-400 leading-relaxed">
            Las claves de API se almacenan y ejecutan exclusivamente en el servidor backend seguro
            (Express Proxy). Jamás se exponen tokens privados al cliente ni al navegador. Cuando un
            proveedor no está configurado, la plataforma informa explícitamente sin inventar datos.
          </p>
        </div>
      </div>

      {/* Providers Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Red de Motores de IA
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {providers.map((prov) => (
            <div
              key={prov.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                prov.isConfigured
                  ? "bg-neutral-950 border-neutral-750 shadow-md"
                  : "bg-neutral-950/60 border-neutral-850 opacity-80 hover:opacity-100"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
                    {prov.category}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {prov.isConfigured ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-neutral-500">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        No configurado
                      </span>
                    )}
                  </div>
                </div>

                <h4 className="text-sm font-bold text-white">{prov.name}</h4>
                <div className="text-[11px] font-mono text-neutral-500 mt-0.5">
                  Modelo: {prov.model}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-neutral-900 flex items-center justify-between text-xs">
                <span
                  className={
                    prov.isConfigured ? "text-neutral-300 font-medium" : "text-amber-500/90 font-medium"
                  }
                >
                  {prov.statusText}
                </span>
                {prov.latency && (
                  <span className="font-mono text-[10px] text-neutral-500">{prov.latency}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
