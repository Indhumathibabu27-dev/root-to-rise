import { useState } from 'react';
import { I18nProvider } from './contexts/I18nContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { HistoryProvider } from './contexts/HistoryContext';
import { Layout } from './components/Layout';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { HistoryPage } from './pages/HistoryPage';
import { MarketPage } from './pages/MarketPage';
import type { Page } from './types';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');

  function handleNavigate(page: Page) {
    if (!user && page !== 'login' && page !== 'signup') {
      setCurrentPage('login');
      return;
    }
    if (user && (page === 'login' || page === 'signup')) {
      setCurrentPage('dashboard');
      return;
    }
    setCurrentPage(page);
  }

  // Auth pages render full-screen without layout
  if (!user || currentPage === 'login' || currentPage === 'signup') {
    const authMode: 'login' | 'signup' = currentPage === 'signup' ? 'signup' : 'login';
    return <AuthPage mode={authMode} onNavigate={handleNavigate} />;
  }

  // Authenticated pages with layout
  let pageContent;
  switch (currentPage) {
    case 'dashboard':
      pageContent = <DashboardPage onNavigate={handleNavigate} />;
      break;
    case 'calculator':
      pageContent = <CalculatorPage onNavigate={handleNavigate} />;
      break;
    case 'history':
      pageContent = <HistoryPage />;
      break;
    case 'market':
      pageContent = <MarketPage />;
      break;
    default:
      pageContent = <DashboardPage onNavigate={handleNavigate} />;
  }

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {pageContent}
    </Layout>
  );
}

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <HistoryProvider>
          <AppContent />
        </HistoryProvider>
      </AuthProvider>
    </I18nProvider>
  );
}
