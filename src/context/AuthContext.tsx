import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { getCurrentUser, loginUser, logoutUser, updateUserProfile, DEMO_FARMER, DEMO_OWNER } from '../services/storage';

interface AuthContextValue {
  user: User;
  isFarmer: boolean;
  isOwner: boolean;
  switchRole: (role: UserRole) => void;
  loginAsDemoFarmer: () => void;
  loginAsDemoOwner: () => void;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(() => getCurrentUser());

  useEffect(() => {
    const handleUserChange = () => {
      setUser(getCurrentUser());
    };
    window.addEventListener('krishimitra_user_change', handleUserChange);
    return () => window.removeEventListener('krishimitra_user_change', handleUserChange);
  }, []);

  const switchRole = (role: UserRole) => {
    const newUser = loginUser(role);
    setUser(newUser);
  };

  const loginAsDemoFarmer = () => {
    const u = loginUser('farmer', DEMO_FARMER);
    setUser(u);
  };

  const loginAsDemoOwner = () => {
    const u = loginUser('owner', DEMO_OWNER);
    setUser(u);
  };

  const updateProfile = (updates: Partial<User>) => {
    const updated = updateUserProfile(updates);
    setUser(updated);
  };

  const logout = () => {
    logoutUser();
    setUser(getCurrentUser());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isFarmer: user.role === 'farmer',
        isOwner: user.role === 'owner',
        switchRole,
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
