export type Language = 'EN' | 'HI' | 'GU';

export type UserRole = 'farmer' | 'officer' | 'agronomist' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export interface Treatment {
  type: 'chemical' | 'organic';
  name: string;
  dosage: string;
  safetyNote: string;
  preventionTips: string[];
}

export interface ScanPrediction {
  name: string;
  probability: number;
}

export interface ScanResult {
  id: string;
  crop: string;
  date: string;
  imageUrl: string;
  diseaseName?: string;
  scientificName?: string;
  confidence?: number;
  status: 'healthy' | 'diseased' | 'unknown' | 'pending';
  predictions?: ScanPrediction[];
  treatment?: {
    chemical?: Treatment;
    organic?: Treatment;
  };
}

export interface ScanContextType {
  scans: ScanResult[];
  addScan: (scan: Omit<ScanResult, 'id' | 'date'>) => string;
  updateScan: (id: string, updates: Partial<ScanResult>) => void;
  deleteScan: (id: string) => void;
}

export interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => Promise<void>;
  logout: () => void;
}
