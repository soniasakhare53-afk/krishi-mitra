import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  updateUserProfile,
  isSessionActive,
  DEMO_FARMER,
  DEMO_OWNER,
} from '../services/storage';

interface AuthContextValue {
  user: User;
  isAuthenticated: boolean;
  isFarmer: boolean;
  isOwner: boolean;
  switchRole: (role: UserRole) => void;
  login: (role: UserRole, customUser?: Partial<User>) => void;
  loginAsDemoFarmer: () => void;
  loginAsDemoOwner: () => void;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => getCurrentUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isSessionActive());

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getCurrentUser());
      setIsAuthenticated(isSessionActive());
    };
    window.addEventListener('krishimitra_user_change', handleAuthChange);
    window.addEventListener('krishimitra_auth_change', handleAuthChange);
    return () => {
      window.removeEventListener('krishimitra_user_change', handleAuthChange);
      window.removeEventListener('krishimitra_auth_change', handleAuthChange);
    };
  }, []);

  const switchRole = (role: UserRole) => {
    const newUser = loginUser(role);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const login = (role: UserRole, customUser?: Partial<User>) => {
    const newUser = loginUser(role, customUser);
    setUser(newUser);
    setIsAuthenticated(true);
  };

  const loginAsDemoFarmer = () => {
    const u = loginUser('farmer', DEMO_FARMER);
    setUser(u);
    setIsAuthenticated(true);
  };

  const loginAsDemoOwner = () => {
    const u = loginUser('owner', DEMO_OWNER);
    setUser(u);
    setIsAuthenticated(true);
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = updateUserProfile(updates);
    setUser(updated);
  };

  const logout = () => {
    logoutUser();
    setUser(getCurrentUser());
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isFarmer: user.role === 'farmer',
        isOwner: user.role === 'owner',
        switchRole,
        login,
        loginAsDemoFarmer,
        loginAsDemoOwner,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
