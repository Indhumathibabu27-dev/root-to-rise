import { Sprout, Menu, X, LogOut, Globe } from 'lucide-react';
import { useState } from 'react';
import type { Page } from '../types';
import { useI18n } from '../contexts/I18nContext';
import { useAuth } from '../contexts/AuthContext';

const NAV_PAGES: { page: Page; icon: React.ReactNode }[] = [
  { page: 'dashboard', icon: <LayoutDashboard size={18} /> },
  { page: 'calculator', icon: <Calculator size={18} /> },
  { page: 'history', icon: <History size={18} /> },
  { page: 'market', icon: <TrendingUp size={18} /> },
];

import { LayoutDashboard, Calculator, History, TrendingUp } from 'lucide-react';

export function Navbar({
  currentPage,
  onNavigate,
}: {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}) {
  const { t, lang, toggleLang } = useI18n();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-sm shadow-brand-600/30 group-hover:scale-105 transition-transform">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-display font-bold text-gray-900 text-sm leading-tight">
                {t('appName')}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight hidden sm:block">
                {t('appTagline')}
              </p>
            </div>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_PAGES.map(({ page, icon }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {icon}
                {t(page)}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              title="Switch language"
            >
              <Globe size={16} />
              <span className="hidden sm:inline">{t('langToggle')}</span>
            </button>

            {user && (
              <div className="hidden md:flex items-center gap-3 pl-3 ml-1 border-l border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-[120px] truncate">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={16} />
                  {t('logout')}
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white animate-fade-in">
          <nav className="px-4 py-3 space-y-1">
            {NAV_PAGES.map(({ page, icon }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {icon}
                {t(page)}
              </button>
            ))}
            {user && (
              <>
                <div className="pt-3 mt-2 border-t border-gray-100 flex items-center gap-3 px-3">
                  <div className="w-9 h-9 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-brand-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  {t('logout')}
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
