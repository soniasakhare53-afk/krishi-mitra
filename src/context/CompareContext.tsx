import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Machine } from '../types';
import { getMachineById } from '../services/storage';

interface CompareContextValue {
  compareIds: string[];
  addToCompare: (id: string) => boolean;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  isInCompare: (id: string) => boolean;
  comparedMachines: Machine[];
}

const CompareContext = createContext<CompareContextValue | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('krishimitra_compare_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('krishimitra_compare_ids', JSON.stringify(compareIds));
  }, [compareIds]);

  const addToCompare = (id: string): boolean => {
    if (compareIds.includes(id)) return true;
    if (compareIds.length >= 4) return false; // max 4
    setCompareIds(prev => [...prev, id]);
    return true;
  };

  const removeFromCompare = (id: string) => {
    setCompareIds(prev => prev.filter(i => i !== id));
  };

  const clearCompare = () => {
    setCompareIds([]);
  };

  const isInCompare = (id: string) => compareIds.includes(id);

  const comparedMachines = compareIds
    .map(id => getMachineById(id))
    .filter((m): m is Machine => Boolean(m));

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        comparedMachines,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) {
    throw new Error('useCompare must be used within CompareProvider');
  }
  return ctx;
}
