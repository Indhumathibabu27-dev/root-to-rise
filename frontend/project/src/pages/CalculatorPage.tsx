import { useState, useEffect, useCallback } from 'react';
import {
  Calculator as CalcIcon,
  TrendingUp,
  IndianRupee,
  Warehouse,
  Droplets,
  RotateCcw,
  Info,
  AlertCircle,
  Sparkles,
  Lock,
  LockOpen,
} from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useHistory } from '../contexts/HistoryContext';
import { Button, Input, Select, Card, Badge } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import {
  CROPS,
  calculate,
  formatCurrency,
  getCropDefaults,
  forecastPrice,
  calculateSpoilage,
} from '../lib/calculator';
import type { CalculatorInputs, CalculatorResult, Page, DataSource } from '../types';

const EMPTY_INPUTS: CalculatorInputs = {
  crop: '',
  quantity: 0,
  storageDays: 0,
  currentPrice: 0,
  expectedPrice: 0,
  storageCostPerDay: 0,
  moisture: 0,
  spoilagePercent: 0,
  priceDate: '',
  dataSource: 'sample',
  autoFilled: {
    currentPrice: false,
    storageCost: false,
    moisture: false,
    expectedPrice: false,
    spoilage: false,
  },
};

const LOCKABLE_FIELDS = ['currentPrice', 'storageCostPerDay', 'moisture', 'spoilagePercent'] as const;
type LockableField = (typeof LOCKABLE_FIELDS)[number];

export function CalculatorPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useI18n();
  const { addEntry } = useHistory();

  const [inputs, setInputs] = useState<CalculatorInputs>(EMPTY_INPUTS);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [loadingCrop, setLoadingCrop] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lockedFields, setLockedFields] = useState<Set<LockableField>>(new Set());

  const applyCropDefaults = useCallback(
    (crop: string, currentInputs: CalculatorInputs, locked: Set<LockableField>): CalculatorInputs => {
      const defaults = getCropDefaults(crop);
      if (!defaults) {
        return {
          ...currentInputs,
          crop,
          autoFilled: {
            currentPrice: false,
            storageCost: false,
            moisture: false,
            expectedPrice: false,
            spoilage: false,
          },
        };
      }

      const days = currentInputs.storageDays || 30;
      const expected = forecastPrice(defaults.historicalPrices, days, defaults.currentPrice);
      const spoilage = calculateSpoilage(defaults.spoilageRatePerDay, days);

      return {
        ...currentInputs,
        crop,
        currentPrice: locked.has('currentPrice') ? currentInputs.currentPrice : defaults.currentPrice,
        storageCostPerDay: locked.has('storageCostPerDay') ? currentInputs.storageCostPerDay : defaults.storageCostPerDay,
        moisture: locked.has('moisture') ? currentInputs.moisture : defaults.typicalMoisture,
        spoilagePercent: locked.has('spoilagePercent') ? currentInputs.spoilagePercent : spoilage,
        expectedPrice: expected,
        priceDate: defaults.priceDate,
        dataSource: defaults.dataSource,
        autoFilled: {
          currentPrice: !locked.has('currentPrice'),
          storageCost: !locked.has('storageCostPerDay'),
          moisture: !locked.has('moisture'),
          expectedPrice: true,
          spoilage: !locked.has('spoilagePercent'),
        },
      };
    },
    [],
  );

  // Re-forecast when storage days change (if crop is selected)
  useEffect(() => {
    if (!inputs.crop || inputs.storageDays <= 0) return;
    const defaults = getCropDefaults(inputs.crop);
    if (!defaults) return;

    const expected = forecastPrice(defaults.historicalPrices, inputs.storageDays, defaults.currentPrice);
    const spoilage = calculateSpoilage(defaults.spoilageRatePerDay, inputs.storageDays);

    setInputs((prev) => ({
      ...prev,
      expectedPrice: expected,
      spoilagePercent: lockedFields.has('spoilagePercent') ? prev.spoilagePercent : spoilage,
      autoFilled: {
        ...prev.autoFilled,
        expectedPrice: true,
        spoilage: !lockedFields.has('spoilagePercent'),
      },
    }));
  }, [inputs.storageDays, inputs.crop, lockedFields]);

  function handleCropChange(crop: string): void {
    if (!crop) {
      setInputs(EMPTY_INPUTS);
      setResult(null);
      setErrors({});
      return;
    }
    setLoadingCrop(true);
    setResult(null);
    setErrors({});

    setTimeout(() => {
      setInputs((prev) => applyCropDefaults(crop, prev, lockedFields));
      setLoadingCrop(false);
    }, 400);
  }

  function updateField(field: keyof CalculatorInputs, value: string): void {
    if (field === 'crop') {
      handleCropChange(value);
      return;
    }
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({
      ...prev,
      [field]: numValue,
      autoFilled: {
        ...prev.autoFilled,
        [field === 'storageCostPerDay' ? 'storageCost' : field]: false,
      },
    }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  }

  function toggleLock(field: LockableField): void {
    setLockedFields((prev) => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!inputs.crop) e.crop = t('selectCrop');
    if (inputs.quantity <= 0) e.quantity = t('quantity');
    if (inputs.storageDays <= 0) e.storageDays = t('storageDays');
    if (inputs.currentPrice <= 0) e.currentPrice = t('currentPrice');
    if (inputs.expectedPrice <= 0) e.expectedPrice = t('expectedPrice');
    if (inputs.storageCostPerDay < 0) e.storageCostPerDay = t('storageCostPerDay');
    if (inputs.moisture < 0 || inputs.moisture > 100) e.moisture = t('moisture');
    if (inputs.spoilagePercent < 0 || inputs.spoilagePercent > 100) e.spoilage = t('spoilage');
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleCalculate(): void {
    if (!validate()) return;
    setCalculating(true);
    setTimeout(() => {
      const res = calculate(inputs);
      setResult(res);
      addEntry(inputs, res);
      setCalculating(false);
    }, 500);
  }

  function handleReset(): void {
    setInputs(EMPTY_INPUTS);
    setResult(null);
    setErrors({});
    setLockedFields(new Set());
  }

  const isHold = result?.recommendation === 'hold';
  const moistureHigh = inputs.moisture > 14;
  const hasCropData = inputs.crop && getCropDefaults(inputs.crop) !== null;
  const dataSourceBadge: { label: string; variant: 'warning' | 'success' | 'info' } = {
    label: inputs.dataSource === 'sample' ? t('sampleMode') : inputs.dataSource === 'live' ? 'Live' : t('priceDate'),
    variant: inputs.dataSource === 'sample' ? 'warning' : 'info',
  };

  function AutoFillBadge({ show }: { show: boolean }) {
    if (!show) return null;
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-600 bg-brand-50 rounded-full px-2 py-0.5 ml-2">
        <Sparkles size={10} />
        {t('autoFilled')}
      </span>
    );
  }

  function LockButton({ field }: { field: LockableField }) {
    const locked = lockedFields.has(field);
    return (
      <button
        type="button"
        onClick={() => toggleLock(field)}
        className={`p-1.5 rounded-lg transition-colors ${locked ? 'text-brand-600 bg-brand-50' : 'text-gray-300 hover:text-gray-500'}`}
        title={locked ? 'Unlock to allow auto-update' : 'Lock to prevent auto-update'}
      >
        {locked ? <Lock size={14} /> : <LockOpen size={14} />}
      </button>
    );
  }

  return (
    <div>
      <PageHeader title={t('calcTitle')} subtitle={t('calcSubtitle')} />

      {/* Sample mode notice */}
      {inputs.crop && (
        <div className="mb-4 rounded-xl bg-accent-50 border border-accent-100 px-4 py-3 flex items-start gap-3 animate-fade-in">
          <Info size={18} className="text-accent-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-accent-800">{t('sampleModeNote')}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Input form */}
        <Card className="lg:col-span-3 p-5 sm:p-6 animate-fade-up">
          {/* Crop selection — the main entry point */}
          <div className="mb-4">
            <Select
              label={t('crop')}
              value={inputs.crop}
              onChange={handleCropChange}
              options={CROPS.map((c) => ({ value: c, label: c }))}
              error={errors.crop}
              required
            />
          </div>

          {loadingCrop && (
            <div className="flex items-center justify-center py-8 text-gray-400">
              <span className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
              <span className="text-sm">{t('loadingCropData')}</span>
            </div>
          )}

          {!loadingCrop && inputs.crop && (
            <div className="space-y-4 animate-fade-in">
              {/* Farmer inputs: quantity and storage days */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label={t('quantity')}
                  type="number"
                  value={inputs.quantity || ''}
                  onChange={(v) => updateField('quantity', v)}
                  placeholder="500"
                  error={errors.quantity}
                  required
                  min={0}
                />
                <Input
                  label={t('storageDays')}
                  type="number"
                  value={inputs.storageDays || ''}
                  onChange={(v) => updateField('storageDays', v)}
                  placeholder="30"
                  error={errors.storageDays}
                  required
                  min={0}
                />
              </div>

              <div className="h-px bg-gray-100 my-2" />
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                {t('autoUpdated')}
              </p>

              {/* Auto-filled fields with lock buttons */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('currentPrice')}
                      <AutoFillBadge show={inputs.autoFilled.currentPrice} />
                    </label>
                    <LockButton field="currentPrice" />
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      type="number"
                      value={inputs.currentPrice || ''}
                      onChange={(e) => updateField('currentPrice', e.target.value)}
                      placeholder="0"
                      min={0}
                      step={0.5}
                      className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                        errors.currentPrice ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                      } ${inputs.autoFilled.currentPrice ? 'bg-brand-50/30' : ''}`}
                    />
                  </div>
                  {inputs.priceDate && (
                    <p className="mt-1 text-xs text-gray-400">
                      {t('priceDate')}: {new Date(inputs.priceDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  {errors.currentPrice && <p className="mt-1 text-xs text-red-600">{errors.currentPrice}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('storageCostPerDay')}
                      <AutoFillBadge show={inputs.autoFilled.storageCost} />
                    </label>
                    <LockButton field="storageCostPerDay" />
                  </div>
                  <input
                    type="number"
                    value={inputs.storageCostPerDay || ''}
                    onChange={(e) => updateField('storageCostPerDay', e.target.value)}
                    placeholder="0"
                    min={0}
                    step={0.01}
                    className={`w-full mt-1.5 rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.storageCostPerDay ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                    } ${inputs.autoFilled.storageCost ? 'bg-brand-50/30' : ''}`}
                  />
                  {errors.storageCostPerDay && <p className="mt-1 text-xs text-red-600">{errors.storageCostPerDay}</p>}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('moisture')}
                      <AutoFillBadge show={inputs.autoFilled.moisture} />
                      <span className="ml-1.5 text-[10px] text-gray-400">({t('estimated')})</span>
                    </label>
                    <LockButton field="moisture" />
                  </div>
                  <input
                    type="number"
                    value={inputs.moisture || ''}
                    onChange={(e) => updateField('moisture', e.target.value)}
                    placeholder="0"
                    min={0}
                    max={100}
                    step={0.1}
                    className={`w-full mt-1.5 rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.moisture ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                    } ${inputs.autoFilled.moisture ? 'bg-brand-50/30' : ''}`}
                  />
                  {errors.moisture && <p className="mt-1 text-xs text-red-600">{errors.moisture}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      {t('spoilage')}
                      <AutoFillBadge show={inputs.autoFilled.spoilage} />
                    </label>
                    <LockButton field="spoilagePercent" />
                  </div>
                  <input
                    type="number"
                    value={inputs.spoilagePercent.toFixed(1)}
                    onChange={(e) => updateField('spoilagePercent', e.target.value)}
                    placeholder="0"
                    min={0}
                    max={100}
                    step={0.1}
                    readOnly={inputs.autoFilled.spoilage}
                    className={`w-full mt-1.5 rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                      errors.spoilage ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                    } ${inputs.autoFilled.spoilage ? 'bg-brand-50/30 cursor-not-allowed' : ''}`}
                  />
                  {errors.spoilage && <p className="mt-1 text-xs text-red-600">{errors.spoilage}</p>}
                </div>
              </div>

              {/* Expected future price — auto-forecast */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    {t('expectedPrice')}
                    <AutoFillBadge show={inputs.autoFilled.expectedPrice} />
                  </label>
                  <span className="text-xs text-gray-400">
                    {t('forecastPeriod')}: {inputs.storageDays || 0} {t('days')}
                  </span>
                </div>
                <input
                  type="number"
                  value={inputs.expectedPrice.toFixed(2)}
                  onChange={(e) => updateField('expectedPrice', e.target.value)}
                  placeholder="0"
                  min={0}
                  step={0.5}
                  className={`w-full mt-1.5 rounded-xl border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.expectedPrice ? 'border-red-300 focus:ring-red-400' : 'border-gray-300 focus:ring-brand-500'
                  } ${inputs.autoFilled.expectedPrice ? 'bg-brand-50/30' : ''}`}
                />
                {errors.expectedPrice && <p className="mt-1 text-xs text-red-600">{errors.expectedPrice}</p>}
              </div>

              <div className="flex gap-3 pt-2">
                <Button onClick={handleCalculate} loading={calculating} size="lg" fullWidth>
                  {!calculating && <CalcIcon size={18} />}
                  {calculating ? t('recalculating') : t('calculate')}
                </Button>
                <Button onClick={handleReset} variant="outline" size="lg">
                  <RotateCcw size={18} />
                </Button>
              </div>
            </div>
          )}

          {!loadingCrop && !inputs.crop && (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                <CalcIcon className="w-8 h-8 text-brand-400" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">{t('result')}</p>
              <p className="text-sm text-gray-400 max-w-xs">{t('calcSubtitle')}</p>
            </div>
          )}
        </Card>

        {/* Results panel */}
        <div className="lg:col-span-2 space-y-4">
          {result ? (
            <>
              {/* Data source badge */}
              <div className="flex items-center gap-2 animate-fade-in">
                <Badge variant={dataSourceBadge.variant}>
                  <Info size={12} />
                  {dataSourceBadge.label}
                </Badge>
                {hasCropData && inputs.dataSource === 'sample' && (
                  <span className="text-xs text-gray-400">{t('sampleModeNote').split('.')[0]}.</span>
                )}
              </div>

              {/* Recommendation card */}
              <Card
                className={`p-6 animate-scale-in border-2 ${
                  isHold ? 'border-brand-300 bg-brand-50/30' : 'border-accent-300 bg-accent-50/30'
                }`}
              >
                <p className="text-sm font-medium text-gray-500 mb-2">{t('recommendation')}</p>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isHold ? 'bg-brand-600 text-white' : 'bg-accent-600 text-white'
                    }`}
                  >
                    {isHold ? <Warehouse size={24} /> : <IndianRupee size={24} />}
                  </div>
                  <div>
                    <p className={`text-xl font-display font-bold ${isHold ? 'text-brand-700' : 'text-accent-700'}`}>
                      {isHold ? t('holdStorage') : t('sellNow')}
                    </p>
                    <p className="text-sm text-gray-600 mt-0.5">
                      {isHold ? t('holdAdvice') : t('sellNowAdvice')}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{result.reasonText}</p>
              </Card>

              {/* Breakdown */}
              <Card className="p-5 animate-fade-up-100">
                <div className="space-y-3">
                  <ResultRow
                    icon={<IndianRupee size={16} className="text-accent-600" />}
                    label={t('sellNowValue')}
                    value={formatCurrency(result.sellNowValue)}
                  />
                  <ResultRow
                    icon={<TrendingUp size={16} className="text-brand-600" />}
                    label={t('holdValue')}
                    value={formatCurrency(result.holdValue)}
                  />
                  <ResultRow
                    icon={<Warehouse size={16} className="text-gray-500" />}
                    label={t('storageCostTotal')}
                    value={`- ${formatCurrency(result.storageCost)}`}
                    muted
                  />
                  <ResultRow
                    icon={<AlertCircle size={16} className="text-accent-500" />}
                    label={t('spoilageLoss')}
                    value={`- ${formatCurrency(result.spoilageLoss)}`}
                    muted
                  />
                  <div className="h-px bg-gray-100" />
                  <ResultRow
                    icon={<IndianRupee size={16} />}
                    label={t('netBenefit')}
                    value={`${result.netDifference >= 0 ? '+' : ''}${formatCurrency(result.netDifference)}`}
                    highlight={isHold ? 'brand' : 'accent'}
                  />
                </div>
              </Card>

              {/* Moisture warning */}
              {inputs.moisture > 0 && (
                <Card className={`p-4 animate-fade-up-200 ${moistureHigh ? 'border-accent-200' : 'border-brand-200'}`}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      moistureHigh ? 'bg-accent-50 text-accent-600' : 'bg-brand-50 text-brand-600'
                    }`}>
                      <Droplets size={16} />
                    </div>
                    <p className="text-sm text-gray-700">
                      {moistureHigh ? t('moistHigh') : t('moistOk')}
                    </p>
                  </div>
                </Card>
              )}

              <button
                onClick={() => onNavigate('history')}
                className="w-full text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center justify-center gap-1.5 py-2"
              >
                {t('history')}
                →
              </button>
            </>
          ) : (
            inputs.crop && !loadingCrop && (
              <Card className="p-8 text-center animate-fade-up flex flex-col items-center justify-center min-h-[300px]">
                <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center mb-4">
                  <CalcIcon className="w-8 h-8 text-brand-400" />
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">{t('result')}</p>
                <p className="text-sm text-gray-400 max-w-xs">
                  {t('calculate')}
                </p>
              </Card>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ResultRow({
  icon,
  label,
  value,
  highlight,
  muted,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: 'brand' | 'accent';
  muted?: boolean;
}) {
  const highlightClass = highlight === 'brand'
    ? 'text-brand-700 font-bold text-lg'
    : highlight === 'accent'
    ? 'text-accent-700 font-bold text-lg'
    : 'text-gray-900 font-semibold';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className={`text-sm ${muted ? 'text-gray-400' : 'text-gray-600'}`}>{label}</span>
      </div>
      <span className={`tabular-nums ${highlightClass} ${muted ? 'text-gray-400' : ''}`}>{value}</span>
    </div>
  );
}
