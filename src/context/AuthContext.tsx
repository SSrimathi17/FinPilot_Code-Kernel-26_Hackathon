import React, { createContext, useContext, useState, useEffect } from "react";
import { UserProfile, AuthState } from "../types";

interface AuthContextType {
  authState: AuthState;
  setAuthState: (state: AuthState) => void;
  user: UserProfile;
  login: (email: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  switchProfileRole: (role: UserProfile["occupation"]) => void;
}

const defaultUser: UserProfile = {
  id: "usr_101",
  name: "Alex Morgan",
  email: "alex.morgan@finsmart.app",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  occupation: "Young Professional",
  currency: "$",
  language: "English",
  monthlyIncomeTarget: 4500,
  monthlyExpenseLimit: 3200,
  financialHealthScore: 82,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>("splash");
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("finsmart_user");
    return saved ? JSON.parse(saved) : defaultUser;
  });

  useEffect(() => {
    localStorage.setItem("finsmart_user", JSON.stringify(user));
  }, [user]);

  const login = (email: string, name?: string) => {
    const updated = {
      ...user,
      email,
      name: name || email.split("@")[0] || "User",
    };
    setUser(updated);
    setAuthState("authenticated");
  };

  const logout = () => {
    setAuthState("welcome");
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updated }));
  };

  const switchProfileRole = (role: UserProfile["occupation"]) => {
    const presets: Record<UserProfile["occupation"], Partial<UserProfile>> = {
      Student: {
        occupation: "Student",
        monthlyIncomeTarget: 1200,
        monthlyExpenseLimit: 900,
        financialHealthScore: 74,
      },
      Fresher: {
        occupation: "Fresher",
        monthlyIncomeTarget: 2800,
        monthlyExpenseLimit: 2000,
        financialHealthScore: 79,
      },
      "First-Time Earner": {
        occupation: "First-Time Earner",
        monthlyIncomeTarget: 3200,
        monthlyExpenseLimit: 2300,
        financialHealthScore: 81,
      },
      "Young Professional": {
        occupation: "Young Professional",
        monthlyIncomeTarget: 5000,
        monthlyExpenseLimit: 3400,
        financialHealthScore: 85,
      },
      Family: {
        occupation: "Family",
        monthlyIncomeTarget: 7500,
        monthlyExpenseLimit: 5200,
        financialHealthScore: 88,
      },
      Other: {
        occupation: "Other",
        monthlyIncomeTarget: 4000,
        monthlyExpenseLimit: 3000,
        financialHealthScore: 80,
      },
    };

    setUser((prev) => ({
      ...prev,
      ...presets[role],
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        authState,
        setAuthState,
        user,
        login,
        logout,
        updateProfile,
        switchProfileRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
