import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { HistoryEntry, CalculatorInputs, CalculatorResult } from '../types';
import { api, type ApiHistoryEntry } from '../lib/api';

interface HistoryContextValue {
  entries: HistoryEntry[];
  loading: boolean;
  error: string | null;
  addEntry: (inputs: CalculatorInputs, result: CalculatorResult) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  refresh: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextValue | null>(null);

function mapApiEntry(e: ApiHistoryEntry): HistoryEntry {
  return {
    id: e.id,
    date: e.date,
    crop: e.crop,
    quantity: e.quantity,
    storageDays: e.storageDays,
    recommendation: e.recommendation,
    netDifference: e.netDifference,
  };
}

export function HistoryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getHistory();
      setEntries(data.map(mapApiEntry));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load history');
      setEntries([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const addEntry = useCallback(async (inputs: CalculatorInputs, result: CalculatorResult) => {
    try {
      const entry = await api.saveHistory({
        crop: inputs.crop,
        quantity: inputs.quantity,
        storageDays: inputs.storageDays,
        currentPrice: inputs.currentPrice,
        expectedPrice: inputs.expectedPrice,
        storageCostPerDay: inputs.storageCostPerDay,
        moisture: inputs.moisture,
        spoilagePercent: inputs.spoilagePercent,
        sellNowValue: result.sellNowValue,
        holdValue: result.holdValue,
        storageCostTotal: result.storageCost,
        spoilageLoss: result.spoilageLoss,
        netDifference: result.netDifference,
        recommendation: result.recommendation,
        dataSource: inputs.dataSource,
      });
      setEntries((prev) => [mapApiEntry(entry), ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save calculation');
    }
  }, []);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      await api.deleteHistory(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete entry');
    }
  }, []);

  const clearHistory = useCallback(async () => {
    try {
      await api.clearHistory();
      setEntries([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to clear history');
    }
  }, []);

  return (
    <HistoryContext.Provider value={{ entries, loading, error, addEntry, deleteEntry, clearHistory, refresh: fetchEntries }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const ctx = useContext(HistoryContext);
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider');
  return ctx;
}
