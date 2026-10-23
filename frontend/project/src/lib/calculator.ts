import type { CalculatorInputs, CalculatorResult, DataSource } from '../types';

export const CROPS = [
  'Paddy',
  'Wheat',
  'Groundnut',
  'Maize',
  'Cotton',
  'Sugarcane',
  'Turmeric',
  'Black Gram',
  'Other',
] as const;

export interface CropDefaults {
  currentPrice: number;
  storageCostPerDay: number;
  typicalMoisture: number;
  spoilageRatePerDay: number;
  historicalPrices: { month: string; price: number }[];
  priceDate: string;
  dataSource: DataSource;
}

export const CROP_DEFAULTS: Record<string, CropDefaults> = {
  Paddy: {
    currentPrice: 24.5,
    storageCostPerDay: 0.02,
    typicalMoisture: 13,
    spoilageRatePerDay: 0.04,
    historicalPrices: [
      { month: 'May', price: 21.0 },
      { month: 'Jun', price: 21.8 },
      { month: 'Jul', price: 22.3 },
      { month: 'Aug', price: 23.1 },
      { month: 'Sep', price: 23.8 },
      { month: 'Oct', price: 24.5 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Wheat: {
    currentPrice: 28.0,
    storageCostPerDay: 0.015,
    typicalMoisture: 12,
    spoilageRatePerDay: 0.03,
    historicalPrices: [
      { month: 'May', price: 29.2 },
      { month: 'Jun', price: 29.0 },
      { month: 'Jul', price: 28.5 },
      { month: 'Aug', price: 28.3 },
      { month: 'Sep', price: 28.1 },
      { month: 'Oct', price: 28.0 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Groundnut: {
    currentPrice: 62.0,
    storageCostPerDay: 0.03,
    typicalMoisture: 8,
    spoilageRatePerDay: 0.05,
    historicalPrices: [
      { month: 'May', price: 52.0 },
      { month: 'Jun', price: 54.5 },
      { month: 'Jul', price: 56.0 },
      { month: 'Aug', price: 58.0 },
      { month: 'Sep', price: 60.0 },
      { month: 'Oct', price: 62.0 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Maize: {
    currentPrice: 19.6,
    storageCostPerDay: 0.015,
    typicalMoisture: 14,
    spoilageRatePerDay: 0.04,
    historicalPrices: [
      { month: 'May', price: 19.0 },
      { month: 'Jun', price: 19.2 },
      { month: 'Jul', price: 19.4 },
      { month: 'Aug', price: 19.3 },
      { month: 'Sep', price: 19.5 },
      { month: 'Oct', price: 19.6 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Cotton: {
    currentPrice: 72.0,
    storageCostPerDay: 0.025,
    typicalMoisture: 7,
    spoilageRatePerDay: 0.02,
    historicalPrices: [
      { month: 'May', price: 66.0 },
      { month: 'Jun', price: 67.5 },
      { month: 'Jul', price: 69.0 },
      { month: 'Aug', price: 70.0 },
      { month: 'Sep', price: 71.0 },
      { month: 'Oct', price: 72.0 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Sugarcane: {
    currentPrice: 3.5,
    storageCostPerDay: 0.05,
    typicalMoisture: 70,
    spoilageRatePerDay: 0.5,
    historicalPrices: [
      { month: 'May', price: 3.2 },
      { month: 'Jun', price: 3.3 },
      { month: 'Jul', price: 3.4 },
      { month: 'Aug', price: 3.45 },
      { month: 'Sep', price: 3.5 },
      { month: 'Oct', price: 3.5 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Turmeric: {
    currentPrice: 180.0,
    storageCostPerDay: 0.04,
    typicalMoisture: 10,
    spoilageRatePerDay: 0.02,
    historicalPrices: [
      { month: 'May', price: 140.0 },
      { month: 'Jun', price: 150.0 },
      { month: 'Jul', price: 158.0 },
      { month: 'Aug', price: 165.0 },
      { month: 'Sep', price: 172.0 },
      { month: 'Oct', price: 180.0 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  'Black Gram': {
    currentPrice: 75.0,
    storageCostPerDay: 0.02,
    typicalMoisture: 11,
    spoilageRatePerDay: 0.03,
    historicalPrices: [
      { month: 'May', price: 68.0 },
      { month: 'Jun', price: 70.0 },
      { month: 'Jul', price: 71.5 },
      { month: 'Aug', price: 72.5 },
      { month: 'Sep', price: 73.5 },
      { month: 'Oct', price: 75.0 },
    ],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
  Other: {
    currentPrice: 0,
    storageCostPerDay: 0.02,
    typicalMoisture: 12,
    spoilageRatePerDay: 0.04,
    historicalPrices: [],
    priceDate: '2026-10-01',
    dataSource: 'sample',
  },
};

export function forecastPrice(
  historicalPrices: { month: string; price: number }[],
  daysAhead: number,
  currentPrice: number,
): number {
  if (historicalPrices.length < 2 || daysAhead <= 0) return currentPrice;

  const n = historicalPrices.length;
  const xs = historicalPrices.map((_, i) => i);
  const ys = historicalPrices.map((d) => d.price);

  const sumX = xs.reduce((a, b) => a + b, 0);
  const sumY = ys.reduce((a, b) => a + b, 0);
  const sumXY = xs.reduce((a, _, i) => a + xs[i] * ys[i], 0);
  const sumX2 = xs.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const monthsAhead = daysAhead / 30;
  const forecastIndex = n - 1 + monthsAhead;
  const predicted = slope * forecastIndex + intercept;

  return Math.max(predicted, currentPrice * 0.5);
}

export function calculateSpoilage(spoilageRatePerDay: number, days: number): number {
  return Math.min(spoilageRatePerDay * days, 100);
}

export function calculate(inputs: CalculatorInputs): CalculatorResult {
  const sellNowValue = inputs.quantity * inputs.currentPrice;

  const spoilagePercent = inputs.spoilagePercent;
  const remainingQuantity = inputs.quantity * (1 - spoilagePercent / 100);
  const grossHoldRevenue = remainingQuantity * inputs.expectedPrice;
  const storageCost = inputs.storageCostPerDay * inputs.storageDays * inputs.quantity;
  const holdValue = grossHoldRevenue - storageCost;
  const spoilageLoss = inputs.quantity * inputs.currentPrice * (spoilagePercent / 100);

  const netDifference = holdValue - sellNowValue;
  const recommendation: 'sell' | 'hold' = netDifference > 0 ? 'hold' : 'sell';

  const reasonText = recommendation === 'hold'
    ? `Holding for ${inputs.storageDays} days is estimated to earn ${formatCurrency(Math.abs(netDifference))} more than selling now, after accounting for ${spoilagePercent.toFixed(1)}% spoilage and storage costs.`
    : `Selling now is estimated to earn ${formatCurrency(Math.abs(netDifference))} more than holding for ${inputs.storageDays} days, as storage costs and spoilage outweigh the expected price increase.`;

  return {
    sellNowValue,
    holdValue,
    storageCost,
    spoilageLoss,
    netDifference,
    recommendation,
    reasonText,
  };
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function getCropDefaults(crop: string): CropDefaults | null {
  return CROP_DEFAULTS[crop] ?? null;
}
