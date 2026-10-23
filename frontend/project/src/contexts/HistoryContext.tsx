import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { HistoryEntry, CalculatorInputs, CalculatorResult } from '../types';

interface HistoryContextValue {
  entries: HistoryEntry[];
  addEntry: (inputs: CalculatorInputs, result: CalculatorResult) => void;
  deleteEntry: (id: string) => void;
  clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  const addEntry = useCallback((inputs: CalculatorInputs, result: CalculatorResult) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      crop: inputs.crop,
      quantity: inputs.quantity,
      storageDays: inputs.storageDays,
      recommendation: result.recommendation,
      netDifference: result.netDifference,
    };
    setEntries((prev) => [entry, ...prev]);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  return (
    <HistoryContext.Provider value={{ entries, addEntry, deleteEntry, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
}
