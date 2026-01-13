import { useState, useEffect } from 'react';
import { FuelType } from '@/components/FuelTypeSelect';

export interface FuelPrices {
  pb95: number;
  pb98: number;
  diesel: number;
  lpg: number;
  lastUpdated: string;
  source: string;
}

// Średnie ceny paliw w Polsce - dane z e-petrol.pl
// Aktualizowane co tydzień (środa)
const CURRENT_FUEL_PRICES: FuelPrices = {
  pb95: 5.79,
  pb98: 6.59,
  diesel: 6.17,
  lpg: 2.64,
  lastUpdated: '2025-01-08', // Data ostatniej aktualizacji
  source: 'e-petrol.pl'
};

export const useFuelPrices = () => {
  const [prices, setPrices] = useState<FuelPrices>(CURRENT_FUEL_PRICES);
  const [isLoading, setIsLoading] = useState(false);

  // W przyszłości można tu dodać pobieranie z API
  useEffect(() => {
    // Symulacja ładowania
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPrices(CURRENT_FUEL_PRICES);
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const getPrice = (fuelType: FuelType): number => {
    return prices[fuelType];
  };

  const getPriceString = (fuelType: FuelType): string => {
    return prices[fuelType].toFixed(2);
  };

  return {
    prices,
    isLoading,
    getPrice,
    getPriceString
  };
};

export const getFuelPrices = (): FuelPrices => CURRENT_FUEL_PRICES;
