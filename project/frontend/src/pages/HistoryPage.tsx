import { History as HistoryIcon, Trash2, Eye, X, IndianRupee, TrendingUp, AlertCircle, Loader2, Info } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { useHistory } from '../contexts/HistoryContext';
import { Card, Button, EmptyState, Badge } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { formatCurrency } from '../lib/calculator';
import type { HistoryEntry } from '../types';

export function HistoryPage() {
  const { t } = useI18n();
  const { entries, loading, error, deleteEntry, clearHistory, refresh } = useHistory();
  const [viewEntry, setViewEntry] = useState<HistoryEntry | null>(null);

  return (
    <div>
      <PageHeader
        title={t('historyTitle')}
        subtitle={t('historySubtitle')}
        badge={
          entries.length > 0 ? (
            <Badge variant="info">{entries.length}</Badge>
          ) : undefined
        }
      />

      {/* Demo notice */}
      {!loading && !error && entries.length > 0 && (
        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2.5 flex items-start gap-3">
          <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">{t('demoHistoryNote')}</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Card className="p-6 animate-fade-up">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">{t('historyError')}</p>
            <p className="text-sm text-gray-400 mb-4 max-w-sm">{error}</p>
            <Button onClick={refresh} variant="outline" size="sm">
              {t('retry')}
            </Button>
          </div>
        </Card>
      )}

      {/* Loading state */}
      {loading && !error && (
        <Card className="p-12 animate-fade-up">
          <div className="flex flex-col items-center justify-center text-center">
            <Loader2 size={32} className="text-brand-400 animate-spin mb-4" />
            <p className="text-sm text-gray-400">{t('loadingHistory')}</p>
          </div>
        </Card>
      )}

      {/* Empty state */}
      {!loading && !error && entries.length === 0 && (
        <Card className="animate-fade-up">
          <EmptyState
            icon={<HistoryIcon size={36} />}
            title={t('historyEmpty')}
            description={t('historyEmptyDesc')}
          />
        </Card>
      )}

      {/* List */}
      {!loading && !error && entries.length > 0 && (
        <>
          {/* Desktop table */}
          <Card className="hidden sm:block overflow-hidden animate-fade-up">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{t('date')}</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{t('crop')}</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{t('quantity')}</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{t('recommendationCol')}</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{t('netBenefitCol')}</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wide px-5 py-3">{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-gray-600">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3.5 text-sm font-medium text-gray-900">{entry.crop}</td>
                    <td className="px-5 py-3.5 text-sm text-gray-600 text-right tabular-nums">{entry.quantity} kg</td>
                    <td className="px-5 py-3.5 text-center">
                      <Badge variant={entry.recommendation === 'hold' ? 'success' : 'warning'}>
                        {entry.recommendation === 'hold' ? t('holdStorage') : t('sellNow')}
                      </Badge>
                    </td>
                    <td className={`px-5 py-3.5 text-sm font-semibold text-right tabular-nums ${entry.netDifference >= 0 ? 'text-brand-600' : 'text-accent-600'}`}>
                      {entry.netDifference >= 0 ? '+' : ''}{formatCurrency(entry.netDifference)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewEntry(entry)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                          title={t('view')}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => deleteEntry(entry.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title={t('delete')}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile cards */}
          <div className="sm:hidden space-y-3">
            {entries.map((entry) => (
              <Card key={entry.id} className="p-4 animate-fade-up">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{entry.crop}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <Badge variant={entry.recommendation === 'hold' ? 'success' : 'warning'}>
                    {entry.recommendation === 'hold' ? t('holdStorage') : t('sellNow')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">{t('quantity')}</p>
                    <p className="text-sm font-medium text-gray-700 tabular-nums">{entry.quantity} kg</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">{t('netBenefitCol')}</p>
                    <p className={`text-sm font-semibold tabular-nums ${entry.netDifference >= 0 ? 'text-brand-600' : 'text-accent-600'}`}>
                      {entry.netDifference >= 0 ? '+' : ''}{formatCurrency(entry.netDifference)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
                  <Button size="sm" variant="ghost" onClick={() => setViewEntry(entry)} fullWidth>
                    <Eye size={14} /> {t('view')}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => deleteEntry(entry.id)} fullWidth>
                    <Trash2 size={14} /> {t('delete')}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Clear all */}
          <div className="mt-6 flex justify-end">
            <Button variant="danger" onClick={clearHistory} size="sm">
              <Trash2 size={16} />
              {t('clearHistory')}
            </Button>
          </div>
        </>
      )}

      {/* View modal */}
      {viewEntry && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 animate-fade-in"
          onClick={() => setViewEntry(null)}
        >
          <Card
            className="w-full max-w-md p-6 animate-scale-in"
          >
            <div onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">{t('view')} — {viewEntry.crop}</h3>
                <button
                  onClick={() => setViewEntry(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500">{t('date')}</span>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(viewEntry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500">{t('crop')}</span>
                  <span className="text-sm font-medium text-gray-900">{viewEntry.crop}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500">{t('quantity')}</span>
                  <span className="text-sm font-medium text-gray-900 tabular-nums">{viewEntry.quantity} kg</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500">{t('recommendationCol')}</span>
                  <Badge variant={viewEntry.recommendation === 'hold' ? 'success' : 'warning'}>
                    {viewEntry.recommendation === 'hold' ? (
                      <><TrendingUp size={12} /> {t('holdStorage')}</>
                    ) : (
                      <><IndianRupee size={12} /> {t('sellNow')}</>
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-brand-50">
                  <span className="text-sm font-medium text-brand-700">{t('netBenefitCol')}</span>
                  <span className={`text-sm font-bold tabular-nums ${viewEntry.netDifference >= 0 ? 'text-brand-700' : 'text-accent-700'}`}>
                    {viewEntry.netDifference >= 0 ? '+' : ''}{formatCurrency(viewEntry.netDifference)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
