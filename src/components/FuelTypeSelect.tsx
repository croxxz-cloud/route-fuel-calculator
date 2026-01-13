import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Fuel } from 'lucide-react';

export type FuelType = 'pb95' | 'pb98' | 'diesel' | 'lpg';

interface FuelTypeSelectProps {
  value: FuelType;
  onChange: (value: FuelType) => void;
}

import { getFuelPrices, FuelPrices } from '@/hooks/useFuelPrices';

const fuelTypes: { value: FuelType; label: string }[] = [
  { value: 'pb95', label: 'Pb95' },
  { value: 'pb98', label: 'Pb98' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'lpg', label: 'LPG' },
];

export const getDefaultPrice = (fuelType: FuelType): string => {
  const prices = getFuelPrices();
  return prices[fuelType].toFixed(2);
};

export const FuelTypeSelect = ({ value, onChange }: FuelTypeSelectProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        Rodzaj paliwa
      </label>
      <Select value={value} onValueChange={(v) => onChange(v as FuelType)}>
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-primary" />
            <SelectValue placeholder="Wybierz paliwo" />
          </div>
        </SelectTrigger>
        <SelectContent className="bg-card border-border z-50">
          {fuelTypes.map((fuel) => (
            <SelectItem key={fuel.value} value={fuel.value}>
              {fuel.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
