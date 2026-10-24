import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { Card, Badge } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { LineChart } from '../components/Charts';
import { SAMPLE_MARKET_DATA } from '../lib/sampleData';
import type { CropMarketData } from '../types';

export function MarketPage() {
  const { t, lang } = useI18n();
  const [selectedCrop, setSelectedCrop] = useState<CropMarketData>(SAMPLE_MARKET_DATA[0]);

  const forecastIcon = selectedCrop.forecast === 'up'
    ? <TrendingUp size={16} className="text-brand-600" />
    : selectedCrop.forecast === 'down'
    ? <TrendingDown size={16} className="text-accent-600" />
    : <Minus size={16} className="text-gray-500" />;

  const forecastLabel = selectedCrop.forecast === 'up'
    ? t('trendUp')
    : selectedCrop.forecast === 'down'
    ? t('trendDown')
    : t('trendStable');

  const chartColor = selectedCrop.forecast === 'up' ? '#16a34a' : selectedCrop.forecast === 'down' ? '#d97706' : '#6b7280';

  return (
    <div>
      <PageHeader
        title={t('marketTitle')}
        subtitle={t('marketSubtitle')}
        badge={<Badge variant="warning"><Info size={12} /> {t('sampleData')}</Badge>}
      />

      {/* Sample data notice */}
      <div className="mb-6 rounded-xl bg-accent-50 border border-accent-100 px-4 py-3 flex items-start gap-3 animate-fade-up">
        <Info size={18} className="text-accent-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-accent-800">{t('sampleDataNote')}</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Crop list */}
        <div className="lg:col-span-4 space-y-2.5">
          {SAMPLE_MARKET_DATA.map((crop, i) => {
            const isActive = selectedCrop.crop === crop.crop;
            const isUp = crop.changePercent >= 0;

            return (
              <button
                key={crop.crop}
                onClick={() => setSelectedCrop(crop)}
                className={`w-full text-left animate-fade-up ${isActive ? 'ring-2 ring-brand-500 ring-offset-2' : ''}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Card className={`p-4 transition-all duration-200 hover:shadow-md ${isActive ? 'border-brand-300' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{lang === 'ta' ? crop.cropTa : crop.crop}</p>
                      <p className="text-xs text-gray-400">{lang === 'ta' ? crop.crop : crop.cropTa}</p>
                    </div>
                    <span className={`flex items-center gap-0.5 text-sm font-semibold tabular-nums ${isUp ? 'text-brand-600' : 'text-accent-600'}`}>
                      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      {isUp ? '+' : ''}{crop.changePercent}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-display font-bold text-gray-900 tabular-nums">₹{crop.currentPrice}</span>
                    <span className="text-xs text-gray-400">{crop.unit}</span>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-8 space-y-4">
          {/* Current price + forecast */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 animate-fade-up">
              <p className="text-sm text-gray-500 mb-1">{t('currentPriceLabel')}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display font-bold text-gray-900 tabular-nums">
                  ₹{selectedCrop.currentPrice}
                </span>
                <span className="text-sm text-gray-400">{selectedCrop.unit}</span>
              </div>
              <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${selectedCrop.changePercent >= 0 ? 'text-brand-600' : 'text-accent-600'}`}>
                {selectedCrop.changePercent >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {selectedCrop.changePercent >= 0 ? '+' : ''}{selectedCrop.changePercent}% {t('trendUp')}
              </div>
            </Card>

            <Card className="p-5 animate-fade-up-100">
              <p className="text-sm text-gray-500 mb-1">{t('forecast')}</p>
              <div className="flex items-center gap-2 mt-2">
                {forecastIcon}
                <span className="text-xl font-display font-bold text-gray-900">{forecastLabel}</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {lang === 'ta' ? selectedCrop.cropTa : selectedCrop.crop} — 6 {t('priceTrend')}
              </p>
            </Card>
          </div>

          {/* Line chart */}
          <Card className="p-5 sm:p-6 animate-fade-up-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">{t('priceTrend')}</h3>
              <Badge variant="warning">{t('sampleData')}</Badge>
            </div>
            <div className="bg-gray-50/50 rounded-xl p-4">
              <LineChart data={selectedCrop.trends} color={chartColor} height={240} />
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-400">{t('currentPriceLabel')}</p>
                <p className="text-lg font-bold text-gray-900 tabular-nums">₹{selectedCrop.trends[selectedCrop.trends.length - 1].price}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">6 {t('trendStable').toLowerCase()}</p>
                <p className="text-lg font-bold text-gray-500 tabular-nums">₹{selectedCrop.trends[0].price}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
