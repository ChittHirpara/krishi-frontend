import React, { createContext, useContext, useState } from 'react';
import { Language, LanguageContextType } from '../types';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  EN: {
    'nav.home': 'Home',
    'nav.scan': 'Scan',
    'nav.history': 'History',
    'nav.assistant': 'Assistant',
    'nav.profile': 'Profile',
    'app.title': 'Krishi Raksha',
    'app.subtitle': 'Crop Disease Diagnosis',
  },
  HI: {
    'nav.home': 'होम',
    'nav.scan': 'स्कैन',
    'nav.history': 'इतिहास',
    'nav.assistant': 'सहायक',
    'nav.profile': 'प्रोफ़ाइल',
    'app.title': 'कृषि रक्षा',
    'app.subtitle': 'फसल रोग निदान',
  },
  GU: {
    'nav.home': 'હોમ',
    'nav.scan': 'સ્કેન',
    'nav.history': 'ઇતિહાસ',
    'nav.assistant': 'સહાયક',
    'nav.profile': 'પ્રોફાઇલ',
    'app.title': 'કૃષિ રક્ષા',
    'app.subtitle': 'પાક રોગ નિદાન',
  },
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('EN');

  const t = (key: string) => {
    return translations[language]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
