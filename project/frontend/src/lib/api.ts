const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface ApiHistoryEntry {
  id: string;
  date: string;
  crop: string;
  quantity: number;
  storageDays: number;
  recommendation: 'hold' | 'sell';
  netDifference: number;
}

export interface ApiCalculateResult {
  sellNowValue: number;
  holdValue: number;
  storageCost: number;
  spoilageLoss: number;
  netDifference: number;
  recommendation: 'hold' | 'sell';
  reasonText: string;
}

export interface SaveHistoryPayload {
  crop: string;
  quantity: number;
  storageDays: number;
  currentPrice: number;
  expectedPrice: number;
  storageCostPerDay: number;
  moisture: number;
  spoilagePercent: number;
  sellNowValue: number;
  holdValue: number;
  storageCostTotal: number;
  spoilageLoss: number;
  netDifference: number;
  recommendation: 'hold' | 'sell';
  dataSource: string;
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

export const api = {
  async calculate(payload: {
    crop: string;
    quantity: number;
    storageDays: number;
    currentPrice: number;
    expectedPrice: number;
    storageCostPerDay: number;
    spoilagePercent: number;
  }): Promise<ApiCalculateResult> {
    const res = await fetch(`${API_URL}/api/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return handleResponse<ApiCalculateResult>(res);
  },

  async getHistory(): Promise<ApiHistoryEntry[]> {
    const res = await fetch(`${API_URL}/api/history`);
    const data = await handleResponse<{ entries: ApiHistoryEntry[] }>(res);
    return data.entries;
  },

  async saveHistory(payload: SaveHistoryPayload): Promise<ApiHistoryEntry> {
    const res = await fetch(`${API_URL}/api/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await handleResponse<{ entry: ApiHistoryEntry }>(res);
    return data.entry;
  },

  async deleteHistory(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/history/${id}`, {
      method: 'DELETE',
    });
    await handleResponse(res);
  },

  async clearHistory(): Promise<void> {
    const res = await fetch(`${API_URL}/api/history`, {
      method: 'DELETE',
    });
    await handleResponse(res);
  },
};
