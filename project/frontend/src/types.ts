export type Language = 'en' | 'ta';

export type Page =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'calculator'
  | 'history'
  | 'market';

export interface AuthUser {
  name: string;
  email: string;
}

export type DataSource = 'sample' | 'live' | 'last_available';

export interface CalculatorInputs {
  crop: string;
  quantity: number;
  storageDays: number;
  currentPrice: number;
  expectedPrice: number;
  storageCostPerDay: number;
  moisture: number;
  spoilagePercent: number;
  priceDate: string;
  dataSource: DataSource;
  autoFilled: {
    currentPrice: boolean;
    storageCost: boolean;
    moisture: boolean;
    expectedPrice: boolean;
    spoilage: boolean;
  };
}

export interface CalculatorResult {
  sellNowValue: number;
  holdValue: number;
  storageCost: number;
  spoilageLoss: number;
  netDifference: number;
  recommendation: 'sell' | 'hold';
  reasonText: string;
}

export interface HistoryEntry {
  id: string;
  date: string;
  crop: string;
  quantity: number;
  storageDays: number;
  recommendation: 'sell' | 'hold';
  netDifference: number;
}

export interface MarketTrend {
  month: string;
  price: number;
}

export interface CropMarketData {
  crop: string;
  cropTa: string;
  currentPrice: number;
  unit: string;
  changePercent: number;
  trends: MarketTrend[];
  forecast: 'up' | 'down' | 'stable';
}
