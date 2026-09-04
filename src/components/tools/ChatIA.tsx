import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { ChatMessage, ChatSession } from "../../types";
import { initialChatSessions } from "../../data/initialData";
import {
  MessageSquare,
  Plus,
  Trash2,
  Copy,
  Check,
  Send,
  Sparkles,
  Bot,
  User,
  AlertCircle,
  Clock,
  Cpu,
} from "lucide-react";

export const ChatIA: React.FC = () => {
  const { user, spendPoints, addHistoryItem } = useApp();

  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem("grey_chat_sessions");
      return saved ? JSON.parse(saved) : initialChatSessions;
    } catch {
      return initialChatSessions;
    }
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(sessions[0]?.id || "chat_default");
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    try {
      localStorage.setItem("grey_chat_sessions", JSON.stringify(sessions));
    } catch (e) {
      console.warn("Could not save chat sessions:", e);
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentSession?.messages, isLoading]);

  const handleCreateNewChat = () => {
    const newSession: ChatSession = {
      id: "chat_" + Date.now(),
      title: "Nueva conversación",
      updatedAt: "Ahora",
      messages: [
        {
          id: "msg_" + Date.now(),
          role: "assistant",
          content: `Hola ${user.name}. Soy GREY IA. ¿En qué puedo ayudarte hoy? Puedo estructurar guiones, resolver dudas técnicas o desarrollar ideas cinematográficas.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      handleCreateNewChat();
    }
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (activeSessionId === id && filtered.length > 0) {
      setActiveSessionId(filtered[0].id);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();
    setInputValue("");
    setErrorMessage("");

    const userMessage: ChatMessage = {
      id: "msg_" + Date.now(),
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update session title if first user message
    const updatedMessages = [...(currentSession?.messages || []), userMessage];
    const newTitle =
      currentSession?.messages.length <= 1
        ? userText.slice(0, 30) + (userText.length > 30 ? "..." : "")
        : currentSession?.title;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === currentSession?.id
          ? { ...s, title: newTitle, messages: updatedMessages, updatedAt: "Ahora" }
          : s
      )
    );

    setIsLoading(true);

    try {
      // Call server endpoint
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503 || data.error?.includes("no configurado")) {
          // Fallback response with notice
          const assistantReply: ChatMessage = {
            id: "msg_ai_" + Date.now(),
            role: "assistant",
            content: `**[GREY IA — Motor Local Activo]**\n\nHe interpretado tu consulta sobre «${userText}»:\n\nPara obtener los mejores resultados en tu producción, te recomiendo:\n1. Definir el formato de salida (**9:16** para TikTok/Reels o **16:9** para YouTube).\n2. Utilizar el **Director IA** para desglosar la idea en planos cinematográficos y prompts precisos.\n3. Añadir locución con nuestras voces ultranaturales en **Audio IA**.\n\n*(Nota: Puedes conectar tu propia clave API en **API / AI Hub** para habilitar respuestas directas con Gemini 3.8 Flash).*`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          };

          setSessions((prev) =>
            prev.map((s) =>
              s.id === currentSession?.id
                ? { ...s, messages: [...s.messages, assistantReply] }
                : s
            )
          );
        } else {
          setErrorMessage(data.error || "Error al comunicarse con el modelo.");
        }
      } else {
        const assistantReply: ChatMessage = {
          id: "msg_ai_" + Date.now(),
          role: "assistant",
          content: data.reply || "No se obtuvo respuesta.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setSessions((prev) =>
          prev.map((s) =>
            s.id === currentSession?.id
              ? { ...s, messages: [...s.messages, assistantReply] }
              : s
          )
        );

        addHistoryItem({
          title: `Chat: ${userText.slice(0, 30)}`,
          tool: "Chat IA",
          type: "chat",
          pointsCost: 0,
          status: "completado",
        });
      }
    } catch (err: any) {
      setErrorMessage("No se pudo conectar con el servidor de IA.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 pb-24 h-[calc(100vh-100px)] flex flex-col sm:flex-row gap-4 animate-in fade-in">
      {/* Left Sidebar: Sessions list */}
      <div className="w-full sm:w-72 bg-neutral-950 border border-neutral-850 rounded-3xl p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-900">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Conversaciones
              </span>
            </div>
            <button
              onClick={handleCreateNewChat}
              className="p-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors shadow-sm"
              title="Nueva conversación"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1">
            {sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => setActiveSessionId(s.id)}
                className={`group p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                  activeSessionId === s.id
                    ? "bg-neutral-900 border-neutral-700 text-white font-bold"
                    : "bg-neutral-950/40 border-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-900/60"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Clock className="w-3 h-3 text-neutral-500 shrink-0" />
                  <span className="truncate">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-400 transition-opacity"
                  title="Eliminar chat"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Model info chip */}
        <div className="p-3 rounded-2xl bg-neutral-900/60 border border-neutral-850 text-[11px] text-neutral-400 flex items-center gap-2">
          <Cpu className="w-4 h-4 text-white shrink-0" />
          <div className="truncate">
            <div className="text-white font-bold">Gemini 3.8 Flash</div>
            <div className="text-[10px] text-neutral-500">Modelo conectado</div>
          </div>
        </div>
      </div>

      {/* Right Area: Active Chat */}
      <div className="flex-1 bg-neutral-950 border border-neutral-850 rounded-3xl flex flex-col justify-between overflow-hidden shadow-xl">
        {/* Chat Header */}
        <div className="p-4 border-b border-neutral-900 flex items-center justify-between bg-neutral-900/30">
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide">
              {currentSession?.title || "Chat IA"}
            </h3>
            <span className="text-[10px] text-neutral-400">
              {currentSession?.messages.length || 0} mensajes en esta sesión
            </span>
          </div>
          <button
            onClick={handleCreateNewChat}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo chat</span>
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {currentSession?.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  msg.role === "user"
                    ? "bg-neutral-900 border-neutral-700 text-white"
                    : "bg-white text-black border-white shadow-sm"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4 fill-current" />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-white text-black font-medium rounded-tr-none shadow-md"
                    : "bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    msg.role === "user" ? "text-neutral-600" : "text-neutral-500"
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="p-1 rounded hover:text-white transition-colors"
                    title="Copiar mensaje"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 mr-auto max-w-lg">
              <div className="w-8 h-8 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 fill-current" />
              </div>
              <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-400 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-white animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-white animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1 text-white font-medium">GREY IA está pensando...</span>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-neutral-900 bg-neutral-950">
          <div className="relative flex items-center">
            <input
              id="chat-user-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Pregúntale a GREY IA o escribe tu petición..."
              disabled={isLoading}
              className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 text-xs sm:text-sm focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-white/20 transition-all disabled:opacity-50"
            />
            <button
              id="chat-send-btn"
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-2.5 p-2 rounded-xl bg-white text-black hover:bg-neutral-200 transition-colors disabled:opacity-30 disabled:hover:bg-white"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
