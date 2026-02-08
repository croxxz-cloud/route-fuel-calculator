import { useState, useEffect } from 'react';

export type FuelType = 'pb95' | 'pb98' | 'diesel' | 'lpg';
export type VehicleType = 'fuel' | 'electric';

export interface FuelPrices {
  pb95: number;
  pb98: number;
  diesel: number;
  lpg: number;
  electric: number; // zł/kWh (ładowanie domowe / AC)
  electricDC: number; // zł/kWh (ładowanie szybkie DC na trasie)
  lastUpdated: string;
  source: string;
}

// Średnie ceny paliw w Polsce - dane orientacyjne
const CURRENT_FUEL_PRICES: FuelPrices = {
  pb95: 5.89,
  pb98: 6.69,
  diesel: 6.29,
  lpg: 2.69,
  electric: 0.89,
  electricDC: 2.09, // średnia cena DC fast charging na stacjach (Orlen Charge, GreenWay itp.)
  lastUpdated: '2026-02-01',
  source: 'e-petrol.pl'
};

export const useFuelPrices = () => {
  const [prices, setPrices] = useState<FuelPrices>(CURRENT_FUEL_PRICES);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
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
