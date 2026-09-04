import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Lazy GoogleGenAI initialization
let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// ================= API ROUTES =================

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "GREY IA",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Providers status check
app.get("/api/ai/providers", (req, res) => {
  const geminiAvailable = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    providers: [
      {
        id: "gemini",
        name: "Google Gemini",
        status: geminiAvailable ? "connected" : "ready_to_connect",
        model: "gemini-3.8-flash / gemini-3.1-pro-preview",
        type: "Chat, Guiones, Director, Visión",
      },
      {
        id: "openai",
        name: "OpenAI",
        status: process.env.OPENAI_API_KEY ? "connected" : "ready_to_connect",
        model: "GPT-4o / DALL·E 3",
        type: "Texto e Imágenes",
      },
      {
        id: "runway",
        name: "Runway Gen-3",
        status: process.env.RUNWAY_API_KEY ? "connected" : "ready_to_connect",
        model: "Gen-3 Alpha Turbo",
        type: "Vídeo Cinematográfico",
      },
      {
        id: "replicate",
        name: "Replicate",
        status: process.env.REPLICATE_API_KEY ? "connected" : "ready_to_connect",
        model: "Flux.1 / Stable Video",
        type: "Imágenes y Modelos Abiertos",
      },
      {
        id: "fal",
        name: "Fal.ai",
        status: process.env.FAL_KEY ? "connected" : "ready_to_connect",
        model: "Fast SDXL / Kling",
        type: "Generación Rápida",
      },
      {
        id: "stability",
        name: "Stability AI",
        status: process.env.STABILITY_API_KEY ? "connected" : "ready_to_connect",
        model: "SD3 Ultra",
        type: "Estudio Visual",
      },
    ],
  });
});

// Chat endpoint with Gemini
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.status(503).json({
        error: "Proveedor de IA no configurado.",
        message:
          "La clave GEMINI_API_KEY no está configurada en el servidor. Configúrala en los ajustes para habilitar respuestas automáticas en tiempo real.",
      });
    }

    const contents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction:
          systemPrompt ||
          "Eres GREY IA, el asistente y director maestro de inteligencia artificial más avanzado, profesional y conciso. Responde en español con tono cinematográfico, tecnológico y útil.",
      },
    });

    res.json({
      reply: response.text || "No se pudo generar respuesta.",
    });
  } catch (err: unknown) {
    console.error("Chat error:", err);
    const message = err instanceof Error ? err.message : "Error al procesar la solicitud de chat.";
    res.status(500).json({ error: message });
  }
});

// Director IA: automatic script and production plan generator
app.post("/api/ai/director/plan", async (req, res) => {
  try {
    const { idea, duration = 60, format = "9:16", style = "Cinematográfico" } = req.body;
    const ai = getAI();

    if (!ai) {
      // Fallback structured plan if API key is not yet set
      const defaultScenes = [
        {
          number: 1,
          time: "0:00 - 0:10",
          title: "Gancho inicial de impacto",
          description: `Primer plano impactante relacionado con "${idea.slice(0, 40)}...", captando la atención en los primeros 3 segundos.`,
          imagePrompt: `Cinematic 8k photorealistic close up of ${idea.slice(0, 30)}, dramatic chiaroscuro lighting, deep atmosphere, 9:16 aspect ratio`,
          voiceover: `¿Sabías esto sobre ${idea.slice(0, 25)}? Lo que estás a punto de descubrir cambiará tu perspectiva por completo.`,
          cameraMotion: "Zoom in suave con paneo cinematográfico",
          soundEffect: "Sub bajo cinematográfico y efecto whoosh",
        },
        {
          number: 2,
          time: "0:10 - 0:30",
          title: "Desarrollo del concepto",
          description: "Visualización detallada con movimiento envolvente que explica el núcleo de la idea.",
          imagePrompt: `Wide cinematic shot exploring the depths of ${idea.slice(0, 30)}, hyper-detailed, volumetric fog, studio composition`,
          voiceover: "Durante años se mantuvo en secreto, pero las evidencias demuestran cómo la tecnología y el universo convergen aquí.",
          cameraMotion: "Movimiento de cámara orbital lateral continuo",
          soundEffect: "Textura sonora ambiental progresiva",
        },
        {
          number: 3,
          time: "0:30 - 0:50",
          title: "Clímax visual y revelación",
          description: "La escena culminante con máxima intensidad luminosa y dinamismo.",
          imagePrompt: `Epic climax visual representation of ${idea.slice(0, 30)}, vivid cinematic contrast, motion blur, masterpiece 8k`,
          voiceover: "Y este es el verdadero motivo por el que todo lo que conocías acaba de transformarse.",
          cameraMotion: "Tilt up con aceleración sutil de ángulo",
          soundEffect: "Impacto orquestal híbrido y pulso rítmico",
        },
        {
          number: 4,
          time: "0:50 - 1:00",
          title: "Cierre y llamada a la acción (CTA)",
          description: "Logotipo de GREY IA en pantalla con invitación a guardar y compartir el contenido.",
          imagePrompt: `Sleek minimalist dark studio with glowing triangular emblem G, premium aesthetics, clean typography space`,
          voiceover: "Síguenos para más curiosidades y crea tu propio contenido con GREY IA.",
          cameraMotion: "Travelling hacia atrás suave",
          soundEffect: "Tono sintetizado de cierre y campana sutil",
        },
      ];

      return res.json({
        plan: {
          title: idea.length > 50 ? idea.slice(0, 47) + "..." : idea,
          summary: `Producción automática de ${duration}s optimizada para formato ${format} en estilo ${style}.`,
          scenes: defaultScenes,
          musicStyle: "Cyberpunk Cinematográfico / Ambient Dark",
          suggestedVoice: "Elena (Español Neutro, Narrador Épico)",
          subtitlesStyle: "Palabra por palabra animada en blanco y amarillo",
          estimatedPoints: 85,
        },
      });
    }

    const prompt = `Genera un plan de producción cinematográfico detallado para un vídeo de ${duration} segundos en formato ${format} con estilo "${style}".
Idea del usuario: "${idea}".
Devuelve ÚNICAMENTE un JSON válido con esta estructura exacta:
{
  "title": "Título corto y atractivo",
  "summary": "Resumen ejecutivo del plan",
  "musicStyle": "Estilo de música recomendado",
  "suggestedVoice": "Voz recomendada",
  "subtitlesStyle": "Estilo de subtítulos",
  "estimatedPoints": 90,
  "scenes": [
    {
      "number": 1,
      "time": "0:00 - 0:15",
      "title": "Título escena",
      "description": "Qué ocurre en pantalla",
      "imagePrompt": "Prompt en inglés para generar la imagen cinematográfica",
      "voiceover": "Texto exacto que dirá la voz en off",
      "cameraMotion": "Tipo de movimiento de cámara",
      "soundEffect": "Efecto de sonido recomendado"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({ plan: parsed });
  } catch (err: unknown) {
    console.error("Director plan error:", err);
    res.status(500).json({ error: "Error al generar el plan del Director IA." });
  }
});

// Content generator for Social Media
app.post("/api/ai/content", async (req, res) => {
  try {
    const { platform = "TikTok", type = "Guion", topic, tone = "Impactante" } = req.body;
    const ai = getAI();

    if (!ai) {
      return res.json({
        platform,
        type,
        topic,
        content: `### ${type.toUpperCase()} PARA ${platform.toUpperCase()}\n\n**Tema:** ${topic}\n**Tono:** ${tone}\n\n**1. Gancho (0-3s):**\n"Detén lo que estás haciendo porque esto va a cambiar cómo entiendes ${topic}."\n\n**2. Cuerpo:**\n"Muchos creen que se necesita semanas para dominarlo, pero el secreto está en estructurar cada pieza desde el inicio con IA..."\n\n**3. Llamada a la acción:**\n"Guarda este vídeo para no perderlo y comenta qué opinas."\n\n**Hashtags recomendados:**\n#GreyIA #${platform.replace(/\s+/g, "")} #${topic.replace(/\s+/g, "").slice(0, 15)} #InteligenciaArtificial #Creadores`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Genera contenido del tipo "${type}" para la plataforma "${platform}" sobre el tema "${topic}" con un tono "${tone}".
Incluye ganchos de alta retención, estructura clara, llamadas a la acción y 5-7 hashtags relevantes. Formato en Markdown elegante.`,
            },
          ],
        },
      ],
    });

    res.json({
      platform,
      type,
      topic,
      content: response.text,
    });
  } catch (err: unknown) {
    console.error("Content generation error:", err);
    res.status(500).json({ error: "Error al generar contenido." });
  }
});

// Start server
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`GREY IA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
