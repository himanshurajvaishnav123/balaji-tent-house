import React, { createContext, useContext, useEffect, useState } from 'react';
import { ISiteSettings } from '../types';
import { api } from '../api/client';

const initialSettings: ISiteSettings = {
  businessName: 'BALAJI TENT HOUSE',
  ownerName: 'Yamuna Shankar Bairagi',
  phone: '+919783950350',
  email: 'contact@balajitenthouses.com',
  address: 'Malka khera, sarkari samiti ke samne, bijoliya, Bhilwara',
  ownerPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
  logoUrl: '',
  heroTitle: 'Grand Tent Setup, Royal Weddings & Catering Equipment',
  heroSubtitle: 'Your most trusted event partner in Bijoliya & Bhilwara region. Specialized in Royal Mandap, Waterproof Monsoon Tents & Full Cooking Utensils Rental.',
  heroBannerUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920&auto=format&fit=crop',
  aboutText: 'Welcome to Balaji Tent House, led by Yamuna Shankar Bairagi. With over 15+ years of dedicated service across Bijoliya and the greater Bhilwara district, we deliver majestic shamianas, waterproof pavilions for monsoon events, luxury lighting, and complete sets of traditional cooking equipment and catering utensils for all your celebratory needs.',
};

interface SettingsContextType {
  settings: ISiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettingsState: (newSettings: ISiteSettings) => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: initialSettings,
  loading: true,
  refreshSettings: async () => {},
  updateSettingsState: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISiteSettings>(initialSettings);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      if (res.data?.success && res.data?.settings) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.warn('Backend settings fetch failed or server waking up, using default values.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSettingsState = (newSettings: ISiteSettings) => {
    setSettings(newSettings);
  };

  return (
    <SettingsContext.Provider
      value={{
        settings,
        loading,
        refreshSettings: fetchSettings,
        updateSettingsState,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
