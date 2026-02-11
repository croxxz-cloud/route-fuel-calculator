import { FuelPrices, FuelType, VehicleType } from '@/hooks/useFuelPrices';
import { Zap, TrendingUp } from 'lucide-react';

interface GasStationPricesProps {
  prices: FuelPrices;
  vehicleType: VehicleType;
  selectedFuel?: FuelType;
  onFuelSelect?: (fuel: FuelType) => void;
}

const fuelLabels: Record<FuelType, { short: string; bgColor: string }> = {
  pb95: { short: 'Pb95', bgColor: 'bg-emerald-600' },
  pb98: { short: 'Pb98', bgColor: 'bg-blue-600' },
  diesel: { short: 'ON', bgColor: 'bg-amber-600' },
  lpg: { short: 'LPG', bgColor: 'bg-purple-600' },
};

export const GasStationPrices = ({ 
  prices, 
  vehicleType, 
  selectedFuel,
  onFuelSelect 
}: GasStationPricesProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      month: 'short',
      year: 'numeric'
    });
  };

  if (vehicleType === 'electric') {
    return (
      <div className="bg-card border-2 border-primary/20 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-muted-foreground">
            Średnie ceny prądu ({formatDate(prices.lastUpdated)})
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Stacje DC</span>
            </div>
            <span className="text-lg font-bold text-primary">~1-2 zł</span>
            <span className="text-xs text-muted-foreground">/kWh</span>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Zap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground">Ładowanie w domu</span>
            </div>
            <span className="text-lg font-bold text-primary">~0.65 zł</span>
            <span className="text-xs text-muted-foreground">/kWh</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border-2 border-primary/20 rounded-xl p-4">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          <span className="text-xs font-bold text-foreground">
            Wybierz paliwo (kliknij)
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground">{formatDate(prices.lastUpdated)}</span>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {(Object.keys(fuelLabels) as FuelType[]).map((fuel) => {
          const isSelected = selectedFuel === fuel;
          const { short, bgColor } = fuelLabels[fuel];
          const price = prices[fuel];
          
          return (
            <button
              key={fuel}
              type="button"
              onClick={() => onFuelSelect?.(fuel)}
              className={`relative flex flex-col items-center p-2 rounded-lg transition-all cursor-pointer border-2 ${
                isSelected 
                  ? 'border-primary bg-primary/10 scale-105 shadow-lg ring-2 ring-primary/30' 
                  : 'border-border hover:border-primary/50 hover:bg-muted/50 hover:shadow-md hover:scale-[1.02]'
              }`}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-[8px] font-bold">✓</span>
                </div>
              )}
              
              {/* Fuel label badge */}
              <div className={`${bgColor} text-white text-[10px] font-bold px-2 py-0.5 rounded mb-1.5`}>
                {short}
              </div>
              
              {/* Price display - LED style */}
              <div className="bg-zinc-900 px-2 py-1 rounded border border-zinc-700">
                <span className="font-mono text-base font-bold text-amber-400">
                  {price.toFixed(2)}
                </span>
              </div>
              
              <span className="text-[9px] text-muted-foreground mt-1">zł/l</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
