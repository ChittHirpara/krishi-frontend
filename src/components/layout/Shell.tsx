import React from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { useOffline } from '../../context/OfflineContext';
import { WifiOff } from 'lucide-react';

export function Shell({ children }: { children: React.ReactNode }) {
  const { isOffline } = useOffline();

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-bg-light)] dark:bg-neutral-950">
      <Header />
      {isOffline && (
        <div className="bg-amber-500 text-amber-950 px-4 py-1.5 text-xs font-bold flex items-center justify-center gap-2">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline mode — scans will be queued</span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Navigation />
        <main className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
          <div className="max-w-7xl mx-auto p-4 md:p-6 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
