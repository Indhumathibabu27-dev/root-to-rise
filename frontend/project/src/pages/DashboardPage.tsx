import { Calculator, TrendingUp, History, ArrowRight, Sprout, IndianRupee, Clock, TrendingUp as TrendUp, Award } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';
import { useHistory } from '../contexts/HistoryContext';
import { Card, Badge } from '../components/ui';
import { PageHeader } from '../components/PageHeader';
import { formatCurrency } from '../lib/calculator';
import type { Page } from '../types';

export function DashboardPage({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const { entries } = useHistory();

  const totalCalcs = entries.length;
  const uniqueCrops = new Set(entries.map((e) => e.crop)).size;
  const avgBenefit = totalCalcs > 0
    ? Math.round(entries.reduce((sum, e) => sum + e.netDifference, 0) / totalCalcs)
    : 0;
  const lastCalcDate = entries.length > 0
    ? new Date(entries[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '—';

  const stats = [
    { label: t('statCalculations'), value: String(totalCalcs), icon: <Calculator size={20} />, color: 'brand' },
    { label: t('statCropsTracked'), value: String(uniqueCrops), icon: <Sprout size={20} />, color: 'accent' },
    { label: t('statAvgBenefit'), value: formatCurrency(avgBenefit), icon: <Award size={20} />, color: 'blue' },
    { label: t('statLastCalc'), value: lastCalcDate, icon: <Clock size={20} />, color: 'purple' },
  ];

  const colorMap: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-600',
    accent: 'bg-accent-50 text-accent-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  };

  const quickActions = [
    { page: 'calculator' as Page, title: t('quickActionCalc'), icon: <Calculator size={24} />, desc: t('calcSubtitle') },
    { page: 'market' as Page, title: t('quickActionMarket'), icon: <TrendingUp size={24} />, desc: t('marketSubtitle') },
    { page: 'history' as Page, title: t('quickActionHistory'), icon: <History size={24} />, desc: t('historySubtitle') },
  ];

  return (
    <div>
      <PageHeader
        title={`${t('welcome')}, ${user?.name ?? ''}`}
        subtitle={t('dashboardGreeting')}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((stat, i) => (
          <Card key={i} className={`p-4 sm:p-5 animate-fade-up`} >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[stat.color]}`}>
              {stat.icon}
            </div>
            <p className="text-xl sm:text-2xl font-display font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-gray-900 mb-4 animate-fade-up-100">{t('startCalculation')}</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => onNavigate(action.page)}
            className="group text-left animate-fade-up-200"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <Card className="p-5 h-full hover:shadow-md hover:border-brand-200 transition-all duration-200 group-hover:-translate-y-0.5">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-sm shadow-brand-600/20">
                  {action.icon}
                </div>
                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2">{action.desc}</p>
            </Card>
          </button>
        ))}
      </div>

      {/* Recent activity */}
      <Card className="p-5 sm:p-6 animate-fade-up-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">{t('recentActivity')}</h2>
          {entries.length > 0 && (
            <button onClick={() => onNavigate('history')} className="text-sm font-medium text-brand-600 hover:text-brand-700 flex items-center gap-1">
              {t('history')}
              <ArrowRight size={14} />
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <History className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-700 mb-1">{t('noCalculationsYet')}</p>
            <p className="text-sm text-gray-400 max-w-sm mb-4">{t('noRecentActivity')}</p>
            <button
              onClick={() => onNavigate('calculator')}
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              <Calculator size={16} />
              {t('startCalculation')}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    entry.recommendation === 'hold' ? 'bg-brand-50 text-brand-600' : 'bg-accent-50 text-accent-600'
                  }`}>
                    {entry.recommendation === 'hold' ? <TrendUp size={16} /> : <IndianRupee size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{entry.crop}</p>
                    <p className="text-xs text-gray-400">
                      {entry.quantity} kg · {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={entry.recommendation === 'hold' ? 'success' : 'warning'}>
                    {entry.recommendation === 'hold' ? t('holdStorage') : t('sellNow')}
                  </Badge>
                  <span className={`text-sm font-semibold tabular-nums ${entry.netDifference >= 0 ? 'text-brand-600' : 'text-accent-600'}`}>
                    {entry.netDifference >= 0 ? '+' : ''}{formatCurrency(entry.netDifference)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
