import { Fuel, Info } from 'lucide-react';
import { getFuelPrices } from '@/hooks/useFuelPrices';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FuelComparisonProps {
  distance: number;
  consumption: number;
}

/**
 * Realne mnożniki spalania względem Pb95 (bazowe = 1.00).
 * ON = 0.95 (diesel pali mniej), LPG = 1.20 (wyższe spalanie).
 */
const CONSUMPTION_MULTIPLIERS: Record<string, number> = {
  Pb95: 1.0,
  Pb98: 1.0,
  Diesel: 0.95,
  LPG: 1.2,
};

const getFuelPricesArray = () => {
  const prices = getFuelPrices();
  return [
    { type: 'Pb95', price: prices.pb95, color: 'bg-green-500' },
    { type: 'Pb98', price: prices.pb98, color: 'bg-blue-500' },
    { type: 'Diesel', price: prices.diesel, color: 'bg-amber-500' },
    { type: 'LPG', price: prices.lpg, color: 'bg-purple-500' },
  ];
};

export const FuelComparison = ({ distance, consumption }: FuelComparisonProps) => {
  const fuelPrices = getFuelPricesArray();

  const calculateCost = (price: number, fuelType: string) => {
    const multiplier = CONSUMPTION_MULTIPLIERS[fuelType] ?? 1;
    return (distance / 100) * (consumption * multiplier) * price;
  };

  const costs = fuelPrices.map((f) => ({
    ...f,
    cost: calculateCost(f.price, f.type),
    adjustedConsumption: consumption * (CONSUMPTION_MULTIPLIERS[f.type] ?? 1),
  }));

  const maxCost = Math.max(...costs.map((c) => c.cost));
  const minCost = Math.min(...costs.map((c) => c.cost));

  return (
    <div className="bg-secondary/30 rounded-xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Fuel className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Porównanie paliw</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="w-4 h-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-[260px] text-xs">
              <p>
                Przyjęto typowe różnice spalania: Diesel –5%, LPG +20% względem benzyny.
                Rzeczywiste spalanie zależy od pojazdu.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Koszt tej trasy z różnymi paliwami (z uwzględnieniem typowych różnic spalania):
      </p>
      <div className="space-y-3">
        {costs.map((fuel) => {
          const percentage = (fuel.cost / maxCost) * 100;
          const isCheapest = fuel.cost === minCost;

          return (
            <div key={fuel.type} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {fuel.type}
                  <span className="text-[10px] ml-1 text-muted-foreground/70">
                    ({fuel.adjustedConsumption.toFixed(1)} L/100km)
                  </span>
                </span>
                <span className={`font-semibold ${isCheapest ? 'text-success' : 'text-foreground'}`}>
                  {fuel.cost.toFixed(2)} zł
                  {isCheapest && <span className="text-[10px] ml-1">najtaniej</span>}
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full ${fuel.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground mt-3">
        Różnica najtańsze–najdroższe: {(maxCost - minCost).toFixed(2)} zł
      </p>
    </div>
  );
};
