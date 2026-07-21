import React, { createContext, useContext, useState, useCallback } from 'react';
import { ScanResult, ScanContextType } from '../types';

const mockScans: ScanResult[] = [
  {
    id: 'scan-1',
    crop: 'Tomato',
    date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80',
    diseaseName: 'Early Blight',
    scientificName: 'Alternaria solani',
    confidence: 88,
    status: 'diseased',
    predictions: [
      { name: 'Early Blight', probability: 88 },
      { name: 'Late Blight', probability: 8 },
      { name: 'Healthy', probability: 4 },
    ],
    treatment: {
      chemical: {
        type: 'chemical',
        name: 'Chlorothalonil 75% WP',
        dosage: '2g per liter of water',
        safetyNote: 'PHI: 7 days. Wear protective gear.',
        preventionTips: ['Rotate crops', 'Avoid overhead irrigation']
      },
      organic: {
        type: 'organic',
        name: 'Copper Soap',
        dosage: 'Spray every 7-10 days',
        safetyNote: 'Safe for organic farming.',
        preventionTips: ['Ensure good air circulation', 'Remove infected leaves']
      }
    }
  },
  {
    id: 'scan-2',
    crop: 'Wheat',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80',
    diseaseName: 'Healthy',
    confidence: 95,
    status: 'healthy',
    predictions: [
      { name: 'Healthy', probability: 95 },
      { name: 'Leaf Rust', probability: 3 },
      { name: 'Powdery Mildew', probability: 2 },
    ]
  },
  {
    id: 'scan-3',
    crop: 'Rice',
    date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3afcb0de51f?auto=format&fit=crop&w=300&q=80',
    diseaseName: 'Brown Spot',
    scientificName: 'Bipolaris oryzae',
    confidence: 45,
    status: 'diseased',
    predictions: [
      { name: 'Brown Spot', probability: 45 },
      { name: 'Blast', probability: 30 },
      { name: 'Healthy', probability: 25 },
    ],
    treatment: {
      chemical: {
        type: 'chemical',
        name: 'Mancozeb 75% WP',
        dosage: '2.5g per liter',
        safetyNote: 'PHI: 15 days.',
        preventionTips: ['Use resistant varieties', 'Maintain proper soil nutrients']
      },
      organic: {
        type: 'organic',
        name: 'Neem Seed Kernel Extract',
        dosage: '5% solution',
        safetyNote: 'Apply in evening.',
        preventionTips: ['Ensure balanced fertilization']
      }
    }
  },
  {
    id: 'scan-4',
    crop: 'Cotton',
    date: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1621245089304-44b25691e84e?auto=format&fit=crop&w=300&q=80',
    diseaseName: 'Aphids',
    scientificName: 'Aphis gossypii',
    confidence: 72,
    status: 'diseased',
    predictions: [
      { name: 'Aphids', probability: 72 },
      { name: 'Whitefly', probability: 15 },
      { name: 'Healthy', probability: 13 },
    ],
    treatment: {
      chemical: {
        type: 'chemical',
        name: 'Imidacloprid 17.8% SL',
        dosage: '0.5ml per liter',
        safetyNote: 'Highly toxic to bees.',
        preventionTips: ['Avoid excess nitrogen', 'Promote natural enemies']
      }
    }
  },
  {
    id: 'scan-5',
    crop: 'Chili',
    date: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1588612140502-0e9bd22fa674?auto=format&fit=crop&w=300&q=80',
    diseaseName: 'Leaf Curl',
    scientificName: 'Chili leaf curl virus',
    confidence: 91,
    status: 'diseased',
    predictions: [
      { name: 'Leaf Curl', probability: 91 },
      { name: 'Mosaic Virus', probability: 5 },
      { name: 'Healthy', probability: 4 },
    ],
    treatment: {
      chemical: {
        type: 'chemical',
        name: 'Acetamiprid 20% SP',
        dosage: '1g per liter',
        safetyNote: 'Vector control (whitefly).',
        preventionTips: ['Use resistant varieties', 'Remove infected plants']
      }
    }
  },
  {
    id: 'scan-6',
    crop: 'Sugarcane',
    date: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=300&q=80',
    diseaseName: 'Red Rot',
    scientificName: 'Colletotrichum falcatum',
    confidence: 82,
    status: 'diseased',
    predictions: [
      { name: 'Red Rot', probability: 82 },
      { name: 'Smut', probability: 12 },
      { name: 'Healthy', probability: 6 },
    ],
    treatment: {
      organic: {
        type: 'organic',
        name: 'Trichoderma viride',
        dosage: 'Apply to soil before planting',
        safetyNote: 'Safe for organic.',
        preventionTips: ['Use healthy seed setts', 'Crop rotation']
      }
    }
  }
];

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export function ScanProvider({ children }: { children: React.ReactNode }) {
  const [scans, setScans] = useState<ScanResult[]>(mockScans);

  const addScan = useCallback((scanData: Omit<ScanResult, 'id' | 'date'>) => {
    const id = `scan-${Date.now()}`;
    const newScan: ScanResult = {
      ...scanData,
      id,
      date: new Date().toISOString(),
    };
    setScans(prev => [newScan, ...prev]);
    return id;
  }, []);

  const updateScan = useCallback((id: string, updates: Partial<ScanResult>) => {
    setScans(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteScan = useCallback((id: string) => {
    setScans(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <ScanContext.Provider value={{ scans, addScan, updateScan, deleteScan }}>
      {children}
    </ScanContext.Provider>
  );
}

export function useScans() {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScans must be used within ScanProvider');
  }
  return context;
}
