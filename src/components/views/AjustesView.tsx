import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import {
  Settings,
  User,
  Shield,
  Globe,
  Bell,
  Zap,
  Moon,
  Save,
  CheckCircle,
  Key,
} from "lucide-react";

export const AjustesView: React.FC = () => {
  const { user, updateUser, points, setPuntosModalOpen, addNotification } = useApp();

  const [activeTab, setActiveTab] = useState<"perfil" | "seguridad" | "preferencias" | "plan">("perfil");

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);
  const [language, setLanguage] = useState("Español (ES)");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyBrowser, setNotifyBrowser] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, avatar });
    setSavedSuccess(true);
    addNotification({
      title: "Ajustes actualizados",
      message: "Tu perfil ha sido actualizado correctamente.",
      type: "success",
    });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6 animate-in fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800 text-white">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">AJUSTES</h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Personalización de cuenta, seguridad, idiomas y gestión del plan de suscripción.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: "perfil", label: "Perfil de Usuario", icon: <User className="w-4 h-4" /> },
          { id: "seguridad", label: "Contraseña & Seguridad", icon: <Shield className="w-4 h-4" /> },
          { id: "preferencias", label: "Preferencias & Idioma", icon: <Globe className="w-4 h-4" /> },
          { id: "plan", label: "Plan & Puntos", icon: <Zap className="w-4 h-4" /> },
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

      {/* Main Settings Card */}
      <div className="p-6 rounded-3xl bg-neutral-950 border border-neutral-850 shadow-xl space-y-6">
        {/* TAB 1: PERFIL */}
        {activeTab === "perfil" && (
          <form onSubmit={handleSaveProfile} className="space-y-5 max-w-xl">
            <div className="flex items-center gap-4">
              <img
                src={avatar}
                alt={name}
                className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700 shadow-md"
              />
              <div className="flex-1">
                <label className="block text-[10px] font-bold uppercase text-neutral-400 mb-1">
                  URL del Avatar
                </label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-1">
                Correo Electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              />
            </div>

            {savedSuccess && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Cambios guardados con éxito.</span>
              </div>
            )}

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Perfil</span>
            </button>
          </form>
        )}

        {/* TAB 2: SEGURIDAD */}
        {activeTab === "seguridad" && (
          <div className="space-y-6 max-w-xl">
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Cambiar Contraseña
              </h3>
              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">Contraseña Actual</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[10px] text-neutral-400 mb-1">Nueva Contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
                />
              </div>
              <button
                onClick={() => {
                  setCurrentPassword("");
                  setNewPassword("");
                  addNotification({
                    title: "Contraseña actualizada",
                    message: "Tu clave de acceso ha sido cambiada.",
                    type: "success",
                  });
                }}
                className="px-4 py-2 rounded-xl bg-white text-black text-xs font-bold hover:bg-neutral-200"
              >
                Actualizar Clave
              </button>
            </div>

            <div className="pt-4 border-t border-neutral-900 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Autenticación en Dos Pasos (2FA)</h4>
                <p className="text-[11px] text-neutral-400">Protección adicional para tu cuenta</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={(e) => setTwoFactor(e.target.checked)}
                className="accent-white scale-110"
              />
            </div>
          </div>
        )}

        {/* TAB 3: PREFERENCIAS */}
        {activeTab === "preferencias" && (
          <div className="space-y-5 max-w-xl">
            <div>
              <label className="block text-[11px] font-bold uppercase text-neutral-400 mb-2">
                Idioma de la Interfaz
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white"
              >
                <option value="Español (ES)">Español (ES)</option>
                <option value="English (US)">English (US)</option>
                <option value="Français (FR)">Français (FR)</option>
                <option value="Deutsch (DE)">Deutsch (DE)</option>
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850 space-y-3">
              <span className="text-[11px] font-bold uppercase text-neutral-300">
                Notificaciones
              </span>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Alertas por email al completar renderizados</span>
                <input
                  type="checkbox"
                  checked={notifyEmail}
                  onChange={(e) => setNotifyEmail(e.target.checked)}
                  className="accent-white"
                />
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400">Notificaciones push en navegador</span>
                <input
                  type="checkbox"
                  checked={notifyBrowser}
                  onChange={(e) => setNotifyBrowser(e.target.checked)}
                  className="accent-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-900/40 border border-neutral-850">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-white" />
                <div>
                  <h4 className="text-xs font-bold text-white">Tema Visual</h4>
                  <span className="text-[11px] text-neutral-400">Dark Cinematic (Exclusivo GREY IA)</span>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                Fijo / Optimizado
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: PLAN & PUNTOS */}
        {activeTab === "plan" && (
          <div className="space-y-6 max-w-xl">
            <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Plan actual
                </span>
                <div className="text-2xl font-black text-white">{user.plan} CREATOR</div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Acceso a Director IA, renderizado 1080p y modelos neuronales avanzados.
                </p>
              </div>
              <button
                onClick={() => setPuntosModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-colors shadow-sm"
              >
                Cambiar Plan
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-850 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Puntos disponibles
                </span>
                <div className="text-2xl font-black text-amber-400">
                  ⚡ {points.toLocaleString()} pts
                </div>
              </div>
              <button
                onClick={() => setPuntosModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs transition-colors"
              >
                Recargar Puntos
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
