import React from "react";

interface GreyLogoProps {
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  className?: string;
  showText?: boolean;
  glow?: boolean;
}

export const GreyLogo: React.FC<GreyLogoProps> = ({
  size = "md",
  className = "",
  showText = false,
  glow = true,
}) => {
  // Dimensions map
  const sizeMap = {
    sm: { svgSize: 28, gSize: "text-sm", stroke: 2, padding: "p-0.5" },
    md: { svgSize: 38, gSize: "text-base", stroke: 2.5, padding: "p-1" },
    lg: { svgSize: 64, gSize: "text-2xl", stroke: 3, padding: "p-1.5" },
    xl: { svgSize: 110, gSize: "text-5xl", stroke: 4, padding: "p-2" },
    hero: { svgSize: 200, gSize: "text-8xl", stroke: 5, padding: "p-4" },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      {/* Triangle with centered prominent G */}
      <div
        className={`relative flex items-center justify-center ${
          glow ? "drop-shadow-[0_0_28px_rgba(255,255,255,0.45)]" : ""
        }`}
        style={{ width: current.svgSize, height: current.svgSize }}
      >
        {/* SVG Equilateral Triangle with pristine rounded linejoins */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <filter id={`glow-${size}`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <linearGradient id={`grad-${size}`} x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#e0e0e0" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* Glowing subtle ambient outline */}
          {glow && (
            <polygon
              points="50,8 92,86 8,86"
              stroke="white"
              strokeWidth={current.stroke + 4}
              strokeOpacity="0.3"
              strokeLinejoin="round"
              fill="rgba(255, 255, 255, 0.03)"
            />
          )}

          {/* Solid crisp luminous white triangle */}
          <polygon
            points="50,10 90,85 10,85"
            stroke={`url(#grad-${size})`}
            strokeWidth={current.stroke}
            strokeLinejoin="round"
            fill="black"
            filter={glow ? `url(#glow-${size})` : undefined}
          />

          {/* Centered pure white 'G' letter with optical geometry */}
          <text
            x="50"
            y="65"
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FFFFFF"
            fontFamily="'Plus Jakarta Sans', 'Space Grotesk', system-ui, sans-serif"
            fontWeight="900"
            fontSize="48"
            letterSpacing="-0.03em"
            style={{
              textShadow: glow ? "0 0 16px rgba(255,255,255,0.8)" : "none",
            }}
          >
            G
          </text>
        </svg>
      </div>

      {showText && (
        <div className="mt-3 text-center">
          <span
            className={`font-extrabold tracking-[0.22em] text-white ${
              size === "hero" ? "text-3xl" : size === "xl" ? "text-2xl" : "text-base"
            }`}
          >
            GREY IA
          </span>
        </div>
      )}
    </div>
  );
};
