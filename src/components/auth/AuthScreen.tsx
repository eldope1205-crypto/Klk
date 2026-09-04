import React, { useState } from "react";
import { GreyLogo } from "../common/GreyLogo";
import { useApp } from "../../context/AppContext";
import { Zap, ShieldCheck, Cpu, ArrowRight, Eye, EyeOff, Youtube } from "lucide-react";
import mistBg from "../../assets/images/grey_mist_background_1788558167287.jpg";

export const AuthScreen: React.FC = () => {
  const { setIsLoggedIn, user, setUser, authMode, setAuthMode, addNotification } = useApp();

  const [email, setEmail] = useState("alex@greyia.com");
  const [password, setPassword] = useState("••••••••••••");
  const [name, setName] = useState("Alex");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Introduce un correo electrónico válido");
      return;
    }

    if (!password || password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setUser((prev) => ({
        ...prev,
        email,
        name: authMode === "register" ? name || "Usuario" : prev.name || "Alex",
      }));
      setIsLoggedIn(true);
      addNotification({
        title: "Sesión iniciada",
        message: `¡Bienvenido de nuevo a GREY IA, ${name || "Alex"}!`,
        type: "success",
      });
    }, 600);
  };

  const handleSocialLogin = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUser((prev) => ({
        ...prev,
        name: "Alex",
        email: `alex.${provider.toLowerCase()}@greyia.com`,
      }));
      setIsLoggedIn(true);
      addNotification({
        title: `Conectado con ${provider}`,
        message: "Has iniciado sesión correctamente.",
        type: "success",
      });
    }, 500);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white flex flex-col items-center justify-between overflow-x-hidden selection:bg-neutral-800 selection:text-white">
      {/* Background Mist and Fog Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={mistBg}
          alt=""
          className="w-full h-full object-cover object-center opacity-35 filter blur-[1px] scale-105"
        />
        {/* Deep cinematic radial gradient overlays to ensure pure black center & borders */}
        <div className="absolute inset-0 bg-radial from-transparent via-black/80 to-black pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/90 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black via-black/80 to-transparent" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-md px-6 py-10 flex flex-col items-center">
        {/* PROTAGONIST GLOWING WHITE TRIANGLE WITH CENTERED "G" */}
        <div className="relative mb-6 pt-4 flex items-center justify-center">
          {/* Subtle background fog glow ring around the triangle */}
          <div className="absolute -inset-8 bg-white/5 rounded-full filter blur-2xl pointer-events-none" />

          {/* Large, luminous white triangle with centered white 'G' (G de gato, strictly NOT an A) */}
          <GreyLogo size="xl" glow={true} />
        </div>

        {/* Brand Name */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-[0.25em] text-white text-center drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]">
          GREY IA
        </h1>

        {/* Subtitle */}
        <p className="mt-3 text-xs sm:text-sm font-medium tracking-[0.14em] text-neutral-300 text-center uppercase max-w-xs leading-relaxed">
          Tu herramienta definitiva de <br />
          <span className="text-white font-bold tracking-[0.18em]">inteligencia artificial.</span>
        </p>

        {/* Silhouette on Perspective Grid Horizon looking at the glowing Triangle */}
        <div className="relative w-full max-w-xs h-20 my-2 flex items-end justify-center overflow-hidden select-none pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 300 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="horizonGlow" x1="150" y1="15" x2="150" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Horizon line */}
            <line x1="0" y1="28" x2="300" y2="28" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <ellipse cx="150" cy="28" rx="45" ry="12" fill="url(#horizonGlow)" opacity="0.3" />
            {/* Perspective grid lines converging to center (150, 28) */}
            <line x1="150" y1="28" x2="10" y2="80" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            <line x1="150" y1="28" x2="60" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="150" y1="28" x2="110" y2="80" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            <line x1="150" y1="28" x2="150" y2="80" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" />
            <line x1="150" y1="28" x2="190" y2="80" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            <line x1="150" y1="28" x2="240" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="150" y1="28" x2="290" y2="80" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
            {/* Horizontal rungs */}
            <line x1="115" y1="40" x2="185" y2="40" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <line x1="85" y1="55" x2="215" y2="55" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <line x1="45" y1="72" x2="255" y2="72" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
            {/* Lone figure silhouette gazing up */}
            <g transform="translate(144, 15) scale(0.55)">
              <circle cx="11" cy="5" r="4" fill="#000000" stroke="#FFFFFF" strokeWidth="0.9" />
              <path d="M4 13 C4 9, 7 8, 11 8 C15 8, 18 9, 18 13 L16 26 L6 26 Z" fill="#000000" stroke="#FFFFFF" strokeWidth="0.9" />
              <path d="M7 26 L5 44 L9 44 L11 27 L11 27 L13 44 L17 44 L15 26 Z" fill="#000000" stroke="#FFFFFF" strokeWidth="0.9" />
            </g>
          </svg>
        </div>

        {/* 3 Pillars / Características */}
        <div className="w-full grid grid-cols-3 gap-2 mt-4 mb-6">
          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/70 backdrop-blur-sm shadow-sm">
            <Zap className="w-4 h-4 text-white mb-1.5" />
            <span className="text-[11px] font-bold text-white tracking-wider">RÁPIDO</span>
            <span className="text-[9px] text-neutral-400 mt-0.5 leading-tight">Resultados en segundos</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/70 backdrop-blur-sm shadow-sm">
            <ShieldCheck className="w-4 h-4 text-white mb-1.5" />
            <span className="text-[11px] font-bold text-white tracking-wider">SEGURO</span>
            <span className="text-[9px] text-neutral-400 mt-0.5 leading-tight">Tus datos protegidos</span>
          </div>

          <div className="flex flex-col items-center text-center p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/70 backdrop-blur-sm shadow-sm">
            <Cpu className="w-4 h-4 text-white mb-1.5" />
            <span className="text-[11px] font-bold text-white tracking-wider">POTENTE</span>
            <span className="text-[9px] text-neutral-400 mt-0.5 leading-tight">Tecnología de última gen</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full bg-neutral-950/85 border border-neutral-800/90 rounded-2xl p-6 backdrop-blur-md shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/50 text-red-300 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authMode === "register" && (
              <div>
                <label className="block text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                  Nombre completo
                </label>
                <input
                  id="auth-name-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-white/20 transition-all"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold tracking-widest text-neutral-400 uppercase mb-1.5">
                Correo electrónico
              </label>
              <input
                id="auth-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@ejemplo.com"
                className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-white/20 transition-all"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold tracking-widest text-neutral-400 uppercase">
                  Contraseña
                </label>
                {authMode === "login" && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode("forgot");
                      addNotification({
                        title: "Recuperación de contraseña",
                        message: "Te hemos enviado las instrucciones a tu correo.",
                        type: "info",
                      });
                    }}
                    className="text-[11px] text-neutral-400 hover:text-white transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  id="auth-password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-neutral-900/90 border border-neutral-800 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-neutral-500 focus:ring-1 focus:ring-white/20 transition-all pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Iniciar sesión / Registrarse button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black font-bold text-sm tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {authMode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign In */}
          <div className="mt-6 space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                />
              </svg>
              Continuar con Google
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-3 transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12-14.44-6.1-9.35-10.8-19.8-14.1-31.33-3.3-11.53-4.96-22.61-4.96-33.24 0-15.01 3.8-27.42 11.41-37.22 7.6-9.8 17.1-14.75 28.5-14.86 4.58 0 9.77 1.25 15.58 3.75 5.8 2.5 9.77 3.86 11.9 4.08 1.93-.22 5.9-1.58 11.9-4.08 6-2.5 11.1-3.75 15.3-3.75 8.9 0 16.9 2.7 24 8.1 7.1 5.4 12.3 12.5 15.6 21.3-7.8 4.7-13.7 11-17.7 18.9-4 7.9-6 16.6-6 26.1 0 11.1 3.5 20.6 10.5 28.5 7 7.9 15.4 12.7 25.2 14.4-2.2 6.5-4.9 13.2-8.1 20.1zM119.22 31.85c0-7.4 2.6-14.3 7.8-20.7 5.2-6.4 11.7-10.4 19.5-12.1.8 7.4-1.6 14.4-7.2 21-5.6 6.6-12.3 10.8-20.1 11.8z" />
              </svg>
              Continuar con Apple
            </button>
          </div>

          {/* Switch Login / Register */}
          <div className="mt-6 pt-4 border-t border-neutral-850 text-center">
            {authMode === "login" ? (
              <p className="text-xs text-neutral-400">
                ¿No tienes cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("register")}
                  className="text-white font-bold hover:underline transition-all"
                >
                  Regístrate
                </button>
              </p>
            ) : (
              <p className="text-xs text-neutral-400">
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("login")}
                  className="text-white font-bold hover:underline transition-all"
                >
                  Inicia sesión
                </button>
              </p>
            )}
          </div>
        </div>

        {/* Footer info, legal links and small YouTube icon */}
        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-4 text-[11px] text-neutral-400 font-medium">
            <button
              onClick={() => {
                alert("Términos de uso de GREY IA: Licencia para creadores y producción de contenidos audiovisuales con IA.");
              }}
              className="hover:text-white transition-colors"
            >
              Términos de uso
            </button>
            <span>•</span>
            <button
              onClick={() => {
                alert("Política de privacidad: En GREY IA tus datos y claves API están encriptados y protegidos.");
              }}
              className="hover:text-white transition-colors"
            >
              Política de privacidad
            </button>
          </div>

          {/* YouTube icon as featured in reference */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Canal oficial GREY IA en YouTube"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/60 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-all text-[11px]"
          >
            <Youtube className="w-3.5 h-3.5 text-neutral-300" />
            <span>Ver tutoriales en YouTube</span>
          </a>
        </div>
      </div>
    </div>
  );
};
