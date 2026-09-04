import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X, Zap, Gift, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export const PuntosModal: React.FC = () => {
  const {
    points,
    addPoints,
    puntosModalOpen,
    setPuntosModalOpen,
    pointMovements,
    dailyBonusClaimed,
    claimDailyBonus,
    user,
  } = useApp();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  if (!puntosModalOpen) return null;

  const packages = [
    {
      id: "STARTER",
      name: "STARTER",
      points: 1000,
      price: "9,99 €",
      description: "Ideal para creadores ocasionales y pruebas rápidas.",
      features: ["1.000 Puntos IA", "Imágenes y audio estándar", "Exportación 720p"],
    },
    {
      id: "CREATOR",
      name: "CREATOR",
      points: 5000,
      price: "29,99 €",
      description: "Para canales activos de Shorts, TikTok y creadores independientes.",
      features: ["5.000 Puntos IA", "Director IA ilimitado", "Exportación 1080p", "Soporte prioritario"],
      popular: true,
    },
    {
      id: "PRO",
      name: "PRO",
      points: 15000,
      price: "59,99 €",
      description: "Nivel profesional con máxima velocidad de renderizado.",
      features: ["15.000 Puntos IA", "Acceso a modelos de vídeo avanzados", "Exportación 4K", "Licencia comercial"],
      current: user.plan === "PRO",
    },
    {
      id: "ULTRA",
      name: "ULTRA",
      points: 50000,
      price: "149,99 €",
      description: "Producción audiovisual masiva para agencias y productoras.",
      features: ["50.000 Puntos IA", "Servidor de render dedicado", "Claves API personalizadas", "Gestor de cuenta"],
    },
  ];

  const handleSimulatePurchase = (pkg: typeof packages[0]) => {
    setSelectedPlan(pkg.name);
    setTimeout(() => {
      addPoints(pkg.points, `Recarga paquete ${pkg.name}`);
      setSuccessMsg(`¡Has adquirido ${pkg.points.toLocaleString()} puntos con éxito!`);
      setTimeout(() => {
        setSuccessMsg("");
      }, 3500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl p-6 shadow-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                Sistema de Puntos GREY IA
              </h2>
              <p className="text-xs text-neutral-400">
                Administra tus créditos de generación y adquiere paquetes adicionales.
              </p>
            </div>
          </div>
          <button
            onClick={() => setPuntosModalOpen(false)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Bar */}
        <div className="mt-4 p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Saldo disponible
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-white tracking-tight">
                {points.toLocaleString()}
              </span>
              <span className="text-sm font-bold text-amber-400">pts</span>
            </div>
            <span className="text-xs text-neutral-400">
              Plan actual: <strong className="text-white">{user.plan}</strong>
            </span>
          </div>

          {/* Daily bonus */}
          <div className="flex items-center gap-2">
            <button
              onClick={claimDailyBonus}
              disabled={dailyBonusClaimed}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                !dailyBonusClaimed
                  ? "bg-amber-400 hover:bg-amber-300 text-black shadow-lg shadow-amber-400/20 active:scale-95"
                  : "bg-neutral-800 text-neutral-400 cursor-not-allowed"
              }`}
            >
              <Gift className="w-4 h-4" />
              {dailyBonusClaimed ? "Bono diario reclamado (+50)" : "Reclamar +50 pts diarios"}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Packages Grid */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1">
          <div className="mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Paquetes de Puntos
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`relative p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  pkg.popular
                    ? "bg-gradient-to-b from-neutral-900 to-neutral-950 border-neutral-700 shadow-md"
                    : "bg-neutral-900/40 border-neutral-850 hover:border-neutral-700"
                }`}
              >
                {pkg.popular && (
                  <span className="absolute -top-2.5 right-4 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest bg-white text-black">
                    Recomendado
                  </span>
                )}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-extrabold text-white tracking-wider">{pkg.name}</h4>
                    <span className="text-base font-black text-white">{pkg.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs mb-2">
                    <Zap className="w-3.5 h-3.5" />
                    <span>+{pkg.points.toLocaleString()} pts</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed mb-3">
                    {pkg.description}
                  </p>
                  <ul className="space-y-1 mb-4">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="text-[11px] text-neutral-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-neutral-500" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleSimulatePurchase(pkg)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    pkg.popular
                      ? "bg-white text-black hover:bg-neutral-200"
                      : "bg-neutral-800 hover:bg-neutral-700 text-white"
                  }`}
                >
                  <span>Adquirir {pkg.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Movements History */}
          <div className="mt-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Últimos movimientos de puntos
            </h3>
            <div className="space-y-1.5">
              {pointMovements.slice(0, 5).map((mov) => (
                <div
                  key={mov.id}
                  className="p-3 rounded-xl bg-neutral-900/50 border border-neutral-850 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        mov.amount > 0 ? "bg-emerald-400" : "bg-neutral-500"
                      }`}
                    />
                    <div>
                      <div className="font-semibold text-white">{mov.concept}</div>
                      <div className="text-[10px] text-neutral-500">{mov.date}</div>
                    </div>
                  </div>
                  <span
                    className={`font-bold ${
                      mov.amount > 0 ? "text-emerald-400" : "text-neutral-400"
                    }`}
                  >
                    {mov.amount > 0 ? `+${mov.amount.toLocaleString()}` : mov.amount.toLocaleString()} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
