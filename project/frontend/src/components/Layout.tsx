import { type ReactNode } from 'react';
import { Navbar } from './Navbar';
import type { Page } from '../types';

export function Layout({
  children,
  currentPage,
  onNavigate,
}: {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50/30 via-gray-50 to-gray-50">
      <Navbar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
