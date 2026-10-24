import React from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { FinanceProvider } from "./context/FinanceContext";
import { UIProvider } from "./context/UIContext";
import { SplashScreen } from "./components/auth/SplashScreen";
import { WelcomePage } from "./components/auth/WelcomePage";
import { AuthPage } from "./components/auth/AuthPage";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const MainApp: React.FC = () => {
  const { authState } = useAuth();

  switch (authState) {
    case "splash":
      return <SplashScreen />;
    case "welcome":
      return <WelcomePage />;
    case "auth":
      return <AuthPage />;
    case "authenticated":
      return <DashboardLayout />;
    default:
      return <SplashScreen />;
  }
};

export default function App() {
  return (
    <AuthProvider>
      <FinanceProvider>
        <UIProvider>
          <MainApp />
        </UIProvider>
      </FinanceProvider>
    </AuthProvider>
  );
}

