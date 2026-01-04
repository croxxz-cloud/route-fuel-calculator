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

const fuelTypes: { value: FuelType; label: string; defaultPrice: string }[] = [
  { value: 'pb95', label: 'Pb95', defaultPrice: '6.50' },
  { value: 'pb98', label: 'Pb98', defaultPrice: '7.20' },
  { value: 'diesel', label: 'Diesel', defaultPrice: '6.40' },
  { value: 'lpg', label: 'LPG', defaultPrice: '3.00' },
];

export const getDefaultPrice = (fuelType: FuelType): string => {
  return fuelTypes.find(f => f.value === fuelType)?.defaultPrice || '6.50';
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
