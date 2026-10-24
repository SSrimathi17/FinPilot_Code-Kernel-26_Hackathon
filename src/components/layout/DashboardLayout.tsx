import React from "react";
import { Sidebar } from "../common/Sidebar";
import { Header } from "../common/Header";
import { Footer } from "../common/Footer";
import { FloatingAIButton } from "../common/FloatingAIButton";
import { VoiceModal } from "../common/VoiceModal";
import { ToastContainer } from "../common/ToastContainer";
import { useUI } from "../../context/UIContext";

import { HomeDashboardView } from "../views/HomeDashboardView";
import { IncomeView } from "../views/IncomeView";
import { ExpenseView } from "../views/ExpenseView";
import { BudgetView } from "../views/BudgetView";
import { SavingsView } from "../views/SavingsView";
import { InvestmentView } from "../views/InvestmentView";
import { AIAssistantView } from "../views/AIAssistantView";
import { EducationView } from "../views/EducationView";
import { ResourceLocatorView } from "../views/ResourceLocatorView";
import { DocumentVaultView } from "../views/DocumentVaultView";
import { ReportsView } from "../views/ReportsView";
import { NotificationsView } from "../views/NotificationsView";
import { VoiceAssistantView } from "../views/VoiceAssistantView";
import { ProfileView } from "../views/ProfileView";
import { SettingsView } from "../views/SettingsView";

export const DashboardLayout: React.FC = () => {
  const { activeTab, sidebarOpen } = useUI();

  const renderActiveView = () => {
    switch (activeTab) {
      case "home":
        return <HomeDashboardView />;
      case "income":
        return <IncomeView />;
      case "expense":
        return <ExpenseView />;
      case "budget":
        return <BudgetView />;
      case "savings":
        return <SavingsView />;
      case "investment":
        return <InvestmentView />;
      case "ai_assistant":
        return <AIAssistantView />;
      case "education":
        return <EducationView />;
      case "resource_locator":
        return <ResourceLocatorView />;
      case "document_vault":
        return <DocumentVaultView />;
      case "reports":
        return <ReportsView />;
      case "notifications":
        return <NotificationsView />;
      case "voice_assistant":
        return <VoiceAssistantView />;
      case "profile":
        return <ProfileView />;
      case "settings":
        return <SettingsView />;
      default:
        return <HomeDashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1220] text-gray-100 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Toast Overlay */}
      <ToastContainer />

      {/* Main Structural Wrapper */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Pane */}
        <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto transition-all duration-300 ${sidebarOpen ? "lg:pl-64" : "lg:pl-20"}`}>
          {/* Header */}
          <Header />

          {/* View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {renderActiveView()}
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Floating AI Widget Launcher */}
      <FloatingAIButton />

      {/* Interactive Voice Assistant Modal */}
      <VoiceModal />
    </div>
  );
};
