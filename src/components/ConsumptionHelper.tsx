import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';
import { FuelType } from './FuelTypeSelect';

interface ConsumptionHelperProps {
  onSelect: (value: string) => void;
  fuelType?: FuelType;
}

/**
 * Base consumption values are for Pb95/Pb98.
 * Diesel typically uses ~5% less, LPG ~20% more.
 */
const CONSUMPTION_MULTIPLIERS: Record<string, number> = {
  pb95: 1.0,
  pb98: 1.0,
  diesel: 0.95,
  lpg: 1.2,
};

const baseCarTypes = [
  { base: 5.5, label: 'Małe auto' },
  { base: 6.5, label: 'Kompakt' },
  { base: 7.5, label: 'Sedan / Hatchback' },
  { base: 9, label: 'SUV' },
  { base: 11, label: 'Duże SUV / Van' },
];

export const ConsumptionHelper = ({ onSelect, fuelType = 'pb95' }: ConsumptionHelperProps) => {
  const multiplier = CONSUMPTION_MULTIPLIERS[fuelType] ?? 1;

  const carTypes = baseCarTypes.map((car) => {
    const adjusted = +(car.base * multiplier).toFixed(1);
    const rangeLow = +(adjusted - 0.5).toFixed(1);
    const rangeHigh = +(adjusted + 0.5).toFixed(1);
    return {
      value: adjusted.toString(),
      label: car.label,
      description: `${rangeLow}-${rangeHigh} L/100km`,
    };
  });

  return (
    <div className="mt-2">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full h-9 text-xs bg-background border border-border hover:border-primary/40 hover:bg-background transition-colors focus:ring-1 focus:ring-primary/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Nie wiesz ile pali?</span>
          </div>
        </SelectTrigger>
        <SelectContent 
          className="bg-card border-border shadow-xl" 
          style={{ zIndex: 100 }}
          position="popper"
          sideOffset={4}
        >
          {carTypes.map((car) => (
            <SelectItem key={car.value} value={car.value} className="cursor-pointer hover:bg-accent focus:bg-accent">
              <div className="flex flex-col py-0.5">
                <span className="font-medium text-foreground">{car.label}</span>
                <span className="text-xs text-muted-foreground">{car.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Static content for SEO - hidden visually */}
      <ul className="sr-only" aria-hidden="true">
        {carTypes.map((car) => (
          <li key={car.value}>{car.label}: {car.description}</li>
        ))}
      </ul>
    </div>
  );
};
