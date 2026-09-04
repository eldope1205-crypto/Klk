import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  ShieldAlert,
  Users,
  BarChart3,
  Zap,
  Server,
  Settings,
  Lock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

export const AdminPanelView: React.FC = () => {
  const { user, points } = useApp();

  const [activeTab, setActiveTab] = useState<"usuarios" | "metricas" | "servidores" | "config">("metricas");

  const systemUsers = [
    { id: "u1", name: "Alex (Tú)", email: "alex@greyia.com", role: "SuperAdmin", plan: "PRO", points: points, status: "Activo" },
    { id: "u2", name: "Sofia Rivera", email: "sofia@creativa.tv", role: "Creator", plan: "CREATOR", points: 4200, status: "Activo" },
    { id: "u3", name: "Marc Vance", email: "marc@motion.studio", role: "Agency", plan: "ULTRA", points: 38900, status: "Activo" },
    { id: "u4", name: "Elena Gómez", email: "elena@shorts.co", role: "User", plan: "STARTER", points: 650, status: "Inactivo" },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-neutral-300">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white tracking-wide">PANEL ADMIN</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-red-950/80 border border-red-800 text-red-300">
                Restringido
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Supervisión global de usuarios, consumo de puntos y balance de carga de GREY IA.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "metricas", label: "Métricas Globales", icon: <BarChart3 className="w-4 h-4" /> },
          { id: "usuarios", label: "Gestión Usuarios", icon: <Users className="w-4 h-4" /> },
          { id: "servidores", label: "Servidores & API", icon: <Server className="w-4 h-4" /> },
          { id: "config", label: "Configuración General", icon: <Settings className="w-4 h-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`py-3 px-4 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === t.id
                ? "bg-white text-black border-white shadow-md font-extrabold"
                : "bg-neutral-950 border-neutral-850 text-neutral-400 hover:text-white hover:bg-neutral-900"
            }`}
          >
            {t.icon}
            <span className="truncate">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Metrics Tab */}
      {activeTab === "metricas" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850">
              <span className="text-xs text-neutral-400 font-semibold">Usuarios Activos</span>
              <div className="text-3xl font-black text-white mt-1">4.892</div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                +14% este mes
              </span>
            </div>
            <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850">
              <span className="text-xs text-neutral-400 font-semibold">Puntos en Circulación</span>
              <div className="text-3xl font-black text-amber-400 mt-1">1.28M</div>
              <span className="text-[11px] text-neutral-400 mt-1 inline-block">
                Tasa de consumo: 42k/día
              </span>
            </div>
            <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850">
              <span className="text-xs text-neutral-400 font-semibold">Renderizados Hoy</span>
              <div className="text-3xl font-black text-white mt-1">682</div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                99.8% éxito
              </span>
            </div>
            <div className="p-5 rounded-3xl bg-neutral-950 border border-neutral-850">
              <span className="text-xs text-neutral-400 font-semibold">Carga del Servidor</span>
              <div className="text-3xl font-black text-white mt-1">28%</div>
              <span className="text-[11px] text-emerald-400 font-semibold mt-1 inline-block">
                Operación óptima
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "usuarios" && (
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Base de Datos de Usuarios Registrados
            </h3>
            <span className="text-xs text-neutral-500 font-medium">4 usuarios listados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-900 text-[10px] text-neutral-500 uppercase tracking-wider">
                  <th className="pb-3">Usuario</th>
                  <th className="pb-3">Rol</th>
                  <th className="pb-3">Plan</th>
                  <th className="pb-3">Saldo Puntos</th>
                  <th className="pb-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900">
                {systemUsers.map((u) => (
                  <tr key={u.id} className="text-neutral-300">
                    <td className="py-3 font-semibold text-white">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-neutral-500">{u.email}</div>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-300">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 font-bold text-white">{u.plan}</td>
                    <td className="py-3 text-amber-400 font-bold">⚡ {u.points.toLocaleString()}</td>
                    <td className="py-3">
                      <span className="text-emerald-400 text-[11px] font-semibold">
                        ● {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Servers Tab */}
      {activeTab === "servidores" && (
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Nodos de Procesamiento y Clúster
            </h3>
            <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Todos los nodos online
            </span>
          </div>

          <div className="space-y-3">
            {[
              { node: "Node-EU-Central (Render Primario)", load: "34%", ping: "18ms", status: "Saludable" },
              { node: "Node-US-East (Inferencia Gemini)", load: "22%", ping: "94ms", status: "Saludable" },
              { node: "Node-Storage-Global (CDN Assets)", load: "41%", ping: "12ms", status: "Saludable" },
            ].map((n) => (
              <div
                key={n.node}
                className="p-4 rounded-2xl bg-neutral-900/50 border border-neutral-850 flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-bold text-white">{n.node}</h4>
                  <span className="text-[10px] text-neutral-500">Latencia: {n.ping}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-neutral-400 font-semibold">Carga: {n.load}</span>
                  <span className="text-emerald-400 font-bold text-[11px]">● {n.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Config Tab */}
      {activeTab === "config" && (
        <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-5 max-w-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 pb-2 border-b border-neutral-900">
            Parámetros del Sistema
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Modo Mantenimiento</span>
              <input type="checkbox" className="accent-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Registro abierto de nuevos usuarios</span>
              <input type="checkbox" defaultChecked className="accent-white" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-300 font-medium">Bono diario de bienvenida (50 pts)</span>
              <input type="checkbox" defaultChecked className="accent-white" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
