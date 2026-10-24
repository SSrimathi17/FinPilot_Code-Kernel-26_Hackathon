import React, { createContext, useContext, useState } from "react";
import { NavigationTab } from "../types";

interface Toast {
  id: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
}

interface UIContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
  voiceModalOpen: boolean;
  setVoiceModalOpen: (open: boolean) => void;
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"]) => void;
  removeToast: (id: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [aiModalOpen, setAiModalOpen] = useState<boolean>(false);
  const [voiceModalOpen, setVoiceModalOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const showToast = (message: string, type: Toast["type"] = "success") => {
    const id = `toast_${Date.now()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <UIContext.Provider
      value={{
        activeTab,
        setActiveTab,
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        searchQuery,
        setSearchQuery,
        aiModalOpen,
        setAiModalOpen,
        voiceModalOpen,
        setVoiceModalOpen,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error("useUI must be used within a UIProvider");
  return context;
};
