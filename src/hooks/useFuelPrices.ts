import { useState, useEffect } from 'react';

export type FuelType = 'pb95' | 'pb98' | 'diesel' | 'lpg';
export type VehicleType = 'fuel' | 'electric';

export interface FuelPrices {
  pb95: number;
  pb98: number;
  diesel: number;
  lpg: number;
  electric: number; // zł/kWh
  lastUpdated: string;
  source: string;
}

// Średnie ceny paliw w Polsce - dane orientacyjne
// Aktualizowane co tydzień (środa)
const CURRENT_FUEL_PRICES: FuelPrices = {
  pb95: 5.79,
  pb98: 6.59,
  diesel: 6.17,
  lpg: 2.64,
  electric: 0.85, // średnia cena za kWh na stacjach ładowania
  lastUpdated: '2025-01-08', // Data ostatniej aktualizacji
  source: 'ceny orientacyjne'
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

  const getPrice = (fuelType: FuelType | 'electric'): number => {
    return prices[fuelType];
  };

  const getPriceString = (fuelType: FuelType | 'electric'): string => {
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
