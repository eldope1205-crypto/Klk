import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { AuthScreen } from "./components/auth/AuthScreen";
import { Header } from "./components/dashboard/Header";
import { Sidebar } from "./components/dashboard/Sidebar";
import { MobileBottomNav } from "./components/dashboard/MobileBottomNav";
import { DashboardView } from "./components/dashboard/DashboardView";

// Tools
import { DirectorIA } from "./components/tools/DirectorIA";
import { ChatIA } from "./components/tools/ChatIA";
import { ContenidoIA } from "./components/tools/ContenidoIA";
import { ImagenIA } from "./components/tools/ImagenIA";
import { VideoIA } from "./components/tools/VideoIA";
import { EstudioVideoIA } from "./components/tools/EstudioVideoIA";
import { EstudioVisualIA } from "./components/tools/EstudioVisualIA";
import { AudioIA } from "./components/tools/AudioIA";
import { LaboratorioAudio } from "./components/tools/LaboratorioAudio";
import { EditorIA } from "./components/tools/EditorIA";

// Views
import { PlantillasView } from "./components/views/PlantillasView";
import { ProyectosView } from "./components/views/ProyectosView";
import { BibliotecaView } from "./components/views/BibliotecaView";
import { HistorialView } from "./components/views/HistorialView";
import { EstadisticasView } from "./components/views/EstadisticasView";
import { AjustesView } from "./components/views/AjustesView";
import { ApiHubView } from "./components/views/ApiHubView";
import { AdminPanelView } from "./components/views/AdminPanelView";

// Global Modals
import { CreateModal } from "./components/modals/CreateModal";
import { PuntosModal } from "./components/modals/PuntosModal";
import { NotificacionesPanel } from "./components/modals/NotificacionesPanel";

const MainAppContent: React.FC = () => {
  const { isLoggedIn, activeView, setPuntosModalOpen } = useApp();

  // If not logged in, show Part 1: Exterior / Auth screen
  if (!isLoggedIn) {
    return <AuthScreen />;
  }

  // Active view renderer
  const renderActiveView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView />;
      case "director":
        return <DirectorIA />;
      case "chat":
        return <ChatIA />;
      case "contenido":
        return <ContenidoIA />;
      case "imagen":
        return <ImagenIA />;
      case "video":
        return <VideoIA />;
      case "estudio_video":
        return <EstudioVideoIA />;
      case "estudio_visual":
        return <EstudioVisualIA />;
      case "audio":
        return <AudioIA />;
      case "laboratorio_audio":
        return <LaboratorioAudio />;
      case "editor":
        return <EditorIA />;
      case "plantillas":
        return <PlantillasView />;
      case "proyectos":
        return <ProyectosView />;
      case "biblioteca":
        return <BibliotecaView />;
      case "historial":
        return <HistorialView />;
      case "estadisticas":
        return <EstadisticasView />;
      case "ajustes":
        return <AjustesView />;
      case "api":
        return <ApiHubView />;
      case "admin":
        return <AdminPanelView />;
      case "puntos":
        // Automatically open points modal and show dashboard
        setPuntosModalOpen(true);
        return <DashboardView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row antialiased selection:bg-white selection:text-black">
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-neutral-950 overflow-x-hidden">
        {/* Top Header Bar */}
        <Header />

        {/* Dynamic Tool / Dashboard View */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>

        {/* Mobile Fixed Bottom Navigation Bar */}
        <MobileBottomNav />
      </div>

      {/* Global Modals & Slide-overs */}
      <CreateModal />
      <PuntosModal />
      <NotificacionesPanel />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
