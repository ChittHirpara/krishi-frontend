import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useScans } from './ScanContext';
import { useToast } from '../components/ui/Toast';
import { useNotifications } from './NotificationContext';

export interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const { scans, updateScan } = useScans();
  const { addToast } = useToast();
  const { addNotification } = useNotifications();

  const toggleOffline = useCallback(() => {
    setIsOffline(prev => !prev);
  }, []);

  useEffect(() => {
    if (isOffline) return;

    const pendingScans = scans.filter(s => s.status === 'pending');
    if (pendingScans.length === 0) return;

    const timer = setTimeout(() => {
      pendingScans.forEach(scan => {
        updateScan(scan.id, {
          status: 'diseased',
          diseaseName: 'Early Blight',
          confidence: 92,
          predictions: [
            { name: 'Early Blight', probability: 92 },
            { name: 'Healthy', probability: 8 },
          ],
          treatment: {
            chemical: {
              type: 'chemical',
              name: 'Chlorothalonil 75% WP',
              dosage: '2g per liter of water',
              safetyNote: 'PHI: 7 days.',
              preventionTips: ['Rotate crops', 'Avoid overhead irrigation']
            },
            organic: {
              type: 'organic',
              name: 'Copper Soap',
              dosage: 'Spray every 7-10 days',
              safetyNote: 'Safe for organic farming.',
              preventionTips: ['Ensure good air circulation']
            }
          }
        });
        
        // Add notification for each synced scan
        addNotification({
          type: 'diagnosis',
          title: 'Offline Scan Diagnosed',
          description: `Your queued ${scan.crop} scan has been analyzed: Early Blight (92%)`,
          link: `/app/scan/${scan.id}`
        });
      });
      
      addToast({
        variant: 'success',
        title: 'Sync Complete',
        description: `✅ ${pendingScans.length} scan${pendingScans.length > 1 ? 's' : ''} synced and diagnosed.`
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [isOffline, scans, updateScan, addToast, addNotification]);

  return (
    <OfflineContext.Provider value={{ isOffline, toggleOffline }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within OfflineProvider');
  }
  return context;
}
