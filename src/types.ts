export type ToolId =
  | "dashboard"
  | "director"
  | "chat"
  | "contenido"
  | "imagen"
  | "video"
  | "estudio_video"
  | "estudio_visual"
  | "audio"
  | "laboratorio_audio"
  | "editor"
  | "plantillas"
  | "proyectos"
  | "biblioteca"
  | "historial"
  | "estadisticas"
  | "puntos"
  | "notificaciones"
  | "ajustes"
  | "api"
  | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "creator" | "admin";
  plan: "STARTER" | "CREATOR" | "PRO" | "ULTRA";
  points: number;
  createdAt: string;
}

export interface Scene {
  id: string;
  number: number;
  time: string;
  title: string;
  description: string;
  imagePrompt: string;
  imageUrl?: string;
  voiceover: string;
  cameraMotion: string;
  soundEffect: string;
  durationSeconds: number;
  status: "pending" | "generating" | "ready";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: "video" | "imagen" | "audio" | "director" | "contenido";
  thumbnail: string;
  progress: number;
  lastEdited: string;
  scenes?: Scene[];
  script?: string;
  format: "9:16" | "16:9" | "1:1";
  durationSeconds?: number;
  voice?: string;
  musicTrack?: string;
  subtitlesEnabled?: boolean;
  status: "draft" | "in_progress" | "completed";
}

export interface LibraryItem {
  id: string;
  title: string;
  type: "imagen" | "video" | "audio" | "texto";
  url: string;
  thumbnail?: string;
  format?: string;
  duration?: string;
  dimensions?: string;
  createdAt: string;
  category?: string;
  prompt?: string;
  projectId?: string;
}

export interface GenerationHistoryItem {
  id: string;
  title: string;
  tool: string;
  type: "imagen" | "video" | "audio" | "chat" | "director" | "contenido";
  timestamp: string;
  pointsCost: number;
  status: "completado" | "en_proceso" | "fallido";
  previewUrl?: string;
  details?: string;
}

export type HistoryItem = GenerationHistoryItem;

export interface PointMovement {
  id: string;
  type: "consumo" | "recarga" | "bono";
  amount: number;
  concept: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "success" | "info" | "warning" | "reward";
  actionTool?: ToolId;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface TemplateItem {
  id: string;
  title: string;
  category: "YouTube" | "Shorts" | "TikTok" | "Instagram" | "Vídeo" | "Imagen" | "Audio" | "Contenido" | string;
  description: string;
  thumbnail: string;
  duration?: string;
  durationSeconds?: number;
  format: "9:16" | "16:9" | "1:1";
  pointsRequired: number;
  promptTemplate: string;
}

export type Template = TemplateItem;

export interface StudioTrackClip {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  type: "video" | "image" | "audio" | "voice" | "subtitle";
  content: string;
  color?: string;
}

export interface StudioTrack {
  id: string;
  name: string;
  type: "video" | "text" | "voice" | "music";
  muted: boolean;
  volume: number;
  clips: StudioTrackClip[];
}

export interface ProviderInfo {
  id: string;
  name: string;
  status: "connected" | "ready_to_connect" | "offline";
  model: string;
  type: string;
  keyConfigured: boolean;
}
