import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ToolId,
  UserProfile,
  Project,
  LibraryItem,
  GenerationHistoryItem,
  PointMovement,
  NotificationItem,
} from "../types";
import {
  initialUser,
  initialProjects,
  initialLibraryItems,
  initialHistory,
  initialPointMovements,
  initialNotifications,
} from "../data/initialData";

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  authMode: "login" | "register" | "forgot";
  setAuthMode: (mode: "login" | "register" | "forgot") => void;
  activeView: ToolId;
  setActiveView: (view: ToolId) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  projects: Project[];
  activeProject: Project | null;
  setActiveProject: (p: Project | null) => void;
  createProject: (data: Partial<Project>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => void;
  libraryItems: LibraryItem[];
  addLibraryItem: (item: Omit<LibraryItem, "id" | "createdAt">) => LibraryItem;
  deleteLibraryItem: (id: string) => void;
  history: GenerationHistoryItem[];
  addHistoryItem: (item: Omit<GenerationHistoryItem, "id" | "timestamp">) => void;
  pointMovements: PointMovement[];
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => void;
  points: number;
  spendPoints: (amount: number, concept: string) => boolean;
  addPoints: (amount: number, concept: string) => void;
  dailyBonusClaimed: boolean;
  claimDailyBonus: () => boolean;
  puntosModalOpen: boolean;
  setPuntosModalOpen: (open: boolean) => void;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  createModalOpen: boolean;
  setCreateModalOpen: (open: boolean) => void;
  sharedAsset: { toolId: ToolId; assetData: any } | null;
  sendAssetToTool: (toolId: ToolId, assetData: any) => void;
  clearSharedAsset: () => void;
  quickStats: {
    generations: number;
    timeSaved: string;
    projectsCount: number;
    productivity: string;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state or local storage
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem("grey_user");
      return saved ? JSON.parse(saved) : initialUser;
    } catch {
      return initialUser;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem("grey_logged_in") === "true";
    } catch {
      return false;
    }
  });

  const [authMode, setAuthMode] = useState<"login" | "register" | "forgot">("login");
  const [activeView, setActiveView] = useState<ToolId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem("grey_projects");
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [activeProject, setActiveProject] = useState<Project | null>(() => {
    return initialProjects[0] || null;
  });

  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(() => {
    try {
      const saved = localStorage.getItem("grey_library");
      return saved ? JSON.parse(saved) : initialLibraryItems;
    } catch {
      return initialLibraryItems;
    }
  });

  const [history, setHistory] = useState<GenerationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem("grey_history");
      return saved ? JSON.parse(saved) : initialHistory;
    } catch {
      return initialHistory;
    }
  });

  const [pointMovements, setPointMovements] = useState<PointMovement[]>(() => {
    try {
      const saved = localStorage.getItem("grey_movements");
      return saved ? JSON.parse(saved) : initialPointMovements;
    } catch {
      return initialPointMovements;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem("grey_notifications");
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [points, setPoints] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("grey_points");
      return saved ? Number(saved) : 12560;
    } catch {
      return 12560;
    }
  });

  const [dailyBonusClaimed, setDailyBonusClaimed] = useState<boolean>(() => {
    try {
      const today = new Date().toISOString().split("T")[0];
      return localStorage.getItem("grey_bonus_date") === today;
    } catch {
      return false;
    }
  });

  const [puntosModalOpen, setPuntosModalOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sharedAsset, setSharedAsset] = useState<{ toolId: ToolId; assetData: any } | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem("grey_user", JSON.stringify(user));
      localStorage.setItem("grey_logged_in", String(isLoggedIn));
      localStorage.setItem("grey_projects", JSON.stringify(projects));
      localStorage.setItem("grey_library", JSON.stringify(libraryItems));
      localStorage.setItem("grey_history", JSON.stringify(history));
      localStorage.setItem("grey_movements", JSON.stringify(pointMovements));
      localStorage.setItem("grey_notifications", JSON.stringify(notifications));
      localStorage.setItem("grey_points", String(points));
    } catch (e) {
      console.warn("Storage sync failed:", e);
    }
  }, [user, isLoggedIn, projects, libraryItems, history, pointMovements, notifications, points]);

  // Points manipulation
  const spendPoints = (amount: number, concept: string): boolean => {
    if (points < amount) {
      addNotification({
        title: "Puntos insuficientes",
        message: `Necesitas ${amount} puntos para esta acción. Tienes ${points} pts.`,
        type: "warning",
        actionTool: "puntos",
      });
      setPuntosModalOpen(true);
      return false;
    }

    setPoints((prev) => prev - amount);
    const newMovement: PointMovement = {
      id: "mov_" + Date.now(),
      type: "consumo",
      amount: -amount,
      concept,
      date: "Ahora",
    };
    setPointMovements((prev) => [newMovement, ...prev]);
    return true;
  };

  const addPoints = (amount: number, concept: string) => {
    setPoints((prev) => prev + amount);
    const newMovement: PointMovement = {
      id: "mov_" + Date.now(),
      type: "recarga",
      amount,
      concept,
      date: "Ahora",
    };
    setPointMovements((prev) => [newMovement, ...prev]);
    addNotification({
      title: "Puntos acreditados",
      message: `¡Se han añadido +${amount.toLocaleString()} puntos a tu cuenta!`,
      type: "success",
      actionTool: "puntos",
    });
  };

  const claimDailyBonus = (): boolean => {
    if (dailyBonusClaimed) return false;
    const bonus = 50;
    setPoints((prev) => prev + bonus);
    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem("grey_bonus_date", today);
    setDailyBonusClaimed(true);

    const newMovement: PointMovement = {
      id: "mov_" + Date.now(),
      type: "bono",
      amount: bonus,
      concept: "Recompensa diaria por racha de actividad ⚡",
      date: "Ahora",
    };
    setPointMovements((prev) => [newMovement, ...prev]);
    addNotification({
      title: "¡Recompensa diaria reclamada!",
      message: "Has recibido +50 puntos gratis. ¡Vuelve mañana por más!",
      type: "reward",
      actionTool: "puntos",
    });
    return true;
  };

  // Projects management
  const createProject = (data: Partial<Project>): Project => {
    const newProject: Project = {
      id: "proj_" + Date.now(),
      name: data.name || "Nuevo Proyecto GREY IA",
      description: data.description || "Creado en la plataforma GREY IA",
      category: data.category || "video",
      thumbnail:
        data.thumbnail ||
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80",
      progress: data.progress ?? 15,
      lastEdited: "Recién creado",
      format: data.format || "9:16",
      status: "in_progress",
      scenes: data.scenes || [],
      durationSeconds: data.durationSeconds || 60,
      voice: data.voice || "Elena (Español Neutro)",
      musicTrack: data.musicTrack || "Ambient Cinematic",
      subtitlesEnabled: data.subtitlesEnabled ?? true,
    };

    setProjects((prev) => [newProject, ...prev]);
    setActiveProject(newProject);
    addNotification({
      title: "Proyecto creado",
      message: `El proyecto "${newProject.name}" ha sido creado con éxito.`,
      type: "info",
      actionTool: "proyectos",
    });
    return newProject;
  };

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates, lastEdited: "Hace unos segundos" };
          if (activeProject?.id === id) {
            setActiveProject(updated);
          }
          return updated;
        }
        return p;
      })
    );
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    if (activeProject?.id === id) {
      setActiveProject(null);
    }
    addNotification({
      title: "Proyecto eliminado",
      message: "El proyecto ha sido eliminado de tu espacio de trabajo.",
      type: "info",
    });
  };

  const duplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const copy: Project = {
      ...target,
      id: "proj_" + Date.now(),
      name: `${target.name} (Copia)`,
      lastEdited: "Recién duplicado",
      progress: target.progress,
    };
    setProjects((prev) => [copy, ...prev]);
    addNotification({
      title: "Proyecto duplicado",
      message: `Se ha creado una copia de "${target.name}".`,
      type: "info",
    });
  };

  // Library management
  const addLibraryItem = (item: Omit<LibraryItem, "id" | "createdAt">): LibraryItem => {
    const newItem: LibraryItem = {
      ...item,
      id: "lib_" + Date.now(),
      createdAt: "Ahora",
    };
    setLibraryItems((prev) => [newItem, ...prev]);
    addNotification({
      title: "Elemento guardado",
      message: `"${newItem.title}" guardado en la Biblioteca.`,
      type: "success",
      actionTool: "biblioteca",
    });
    return newItem;
  };

  const deleteLibraryItem = (id: string) => {
    setLibraryItems((prev) => prev.filter((i) => i.id !== id));
  };

  // History tracking
  const addHistoryItem = (item: Omit<GenerationHistoryItem, "id" | "timestamp">) => {
    const newItem: GenerationHistoryItem = {
      ...item,
      id: "hist_" + Date.now(),
      timestamp: "Ahora",
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  // Notification management
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotification = (notif: Omit<NotificationItem, "id" | "timestamp" | "read">) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: "notif_" + Date.now(),
      timestamp: "Ahora",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Connecting tools together
  const sendAssetToTool = (toolId: ToolId, assetData: any) => {
    setSharedAsset({ toolId, assetData });
    setActiveView(toolId);
    setSidebarOpen(false);
    addNotification({
      title: "Elemento transferido",
      message: `Recurso enviado a ${toolId.toUpperCase().replace("_", " ")} correctamente.`,
      type: "info",
      actionTool: toolId,
    });
  };

  const clearSharedAsset = () => setSharedAsset(null);

  const quickStats = {
    generations: history.length + 138,
    timeSaved: "18.5 h",
    projectsCount: projects.length,
    productivity: "+94%",
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        authMode,
        setAuthMode,
        activeView,
        setActiveView,
        sidebarOpen,
        setSidebarOpen,
        projects,
        activeProject,
        setActiveProject,
        createProject,
        updateProject,
        deleteProject,
        duplicateProject,
        libraryItems,
        addLibraryItem,
        deleteLibraryItem,
        history,
        addHistoryItem,
        pointMovements,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        addNotification,
        points,
        spendPoints,
        addPoints,
        dailyBonusClaimed,
        claimDailyBonus,
        puntosModalOpen,
        setPuntosModalOpen,
        notificationsOpen,
        setNotificationsOpen,
        createModalOpen,
        setCreateModalOpen,
        sharedAsset,
        sendAssetToTool,
        clearSharedAsset,
        quickStats,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
