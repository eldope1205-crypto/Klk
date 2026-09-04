import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Zap,
  Sparkles,
  Layers,
  CheckCircle2,
  Calendar,
} from "lucide-react";

export const EstadisticasView: React.FC = () => {
  const { quickStats, points, projects } = useApp();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("7d");

  // Chart data
  const dailyData = [
    { day: "Lun", gens: 18, pts: 320 },
    { day: "Mar", gens: 24, pts: 480 },
    { day: "Mié", gens: 31, pts: 650 },
    { day: "Jue", gens: 28, pts: 540 },
    { day: "Vie", gens: 42, pts: 890 },
    { day: "Sáb", gens: 35, pts: 710 },
    { day: "Dom", gens: 22, pts: 430 },
  ];

  const maxGens = Math.max(...dailyData.map((d) => d.gens));

  const toolUsage = [
    { name: "Director IA", percent: 38, count: "54 ejecuciones", color: "bg-white" },
    { name: "Vídeo IA", percent: 26, count: "37 vídeos", color: "bg-neutral-300" },
    { name: "Imagen IA", percent: 18, count: "25 imágenes", color: "bg-neutral-400" },
    { name: "Audio IA", percent: 12, count: "18 pistas", color: "bg-neutral-500" },
    { name: "Generador de Contenido", percent: 6, count: "8 guiones", color: "bg-neutral-600" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">ESTADÍSTICAS</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Métricas de productividad, ahorro de tiempo y consumo de modelos de IA.
            </p>
          </div>
        </div>

        {/* Time range selector */}
        <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800">
          {(["7d", "30d", "90d"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === range
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {range === "7d" ? "Últimos 7 días" : range === "30d" ? "30 días" : "90 días"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold">Generaciones totales</span>
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {quickStats.generations}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-2 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24% vs semana anterior</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold">Tiempo estimado ahorrado</span>
            <Clock className="w-4 h-4 text-white" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {quickStats.timeSaved}
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Equivalente a ~4 jornadas laborales
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold">Puntos consumidos</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            3.420
          </div>
          <div className="text-[11px] text-neutral-400 mt-2">
            Saldo restante: <strong className="text-white">{points.toLocaleString()} pts</strong>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs text-neutral-400 font-semibold">Índice de productividad</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mt-2">
            {quickStats.productivity}
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-semibold">
            Máxima eficiencia de flujo
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Daily Activity Bar Chart */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
                Generaciones Diarias
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Volumen de creaciones ejecutadas por día
              </p>
            </div>
            <span className="text-xs font-bold text-white bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-xl">
              200 total semanal
            </span>
          </div>

          {/* Bar Visualizer */}
          <div className="h-48 flex items-end justify-between gap-3 pt-4 px-2 select-none">
            {dailyData.map((d) => {
              const heightPercent = (d.gens / maxGens) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-neutral-500 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {d.gens}
                  </span>
                  <div className="w-full bg-neutral-900 rounded-xl overflow-hidden h-36 flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-white rounded-lg transition-all duration-500 group-hover:bg-neutral-200"
                    />
                  </div>
                  <span className="text-xs font-semibold text-neutral-400">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Tools Distribution Breakdown */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-5">
          <div>
            <h3 className="text-sm font-extrabold text-white tracking-wider uppercase">
              Herramientas más usadas
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Distribución de uso en tus producciones
            </p>
          </div>

          <div className="space-y-4">
            {toolUsage.map((tool) => (
              <div key={tool.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{tool.name}</span>
                  <span className="text-neutral-400 font-semibold">{tool.percent}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-neutral-900 overflow-hidden border border-neutral-850">
                  <div
                    style={{ width: `${tool.percent}%` }}
                    className={`h-full ${tool.color} rounded-full`}
                  />
                </div>
                <div className="text-[10px] text-neutral-500">{tool.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
