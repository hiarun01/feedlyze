"use client";

import React, {createContext, useContext, useState, useEffect} from "react";

interface User {
  id: number;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (
    email: string,
    password: string
  ) => Promise<{success: boolean; error?: string}>;
  register: (
    fullName: string,
    email: string,
    password: string
  ) => Promise<{success: boolean; error?: string}>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch("/api/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return {success: true};
      } else {
        return {success: false, error: data.error || "Login failed"};
      }
    } catch (error) {
      console.error("Login error:", error);
      return {success: false, error: "Network error. Please try again."};
    }
  };

  const register = async (
    fullName: string,
    email: string,
    password: string
  ) => {
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({fullName, email, password}),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        return {success: true};
      } else {
        return {success: false, error: data.error || "Registration failed"};
      }
    } catch (error) {
      console.error("Register error:", error);
      return {success: false, error: "Network error. Please try again."};
    }
  };

  const logout = async () => {
    try {
      // Clear user state immediately for better UX
      setUser(null);

      // Call logout API
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, user is logged out locally
      window.location.href = "/";
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
