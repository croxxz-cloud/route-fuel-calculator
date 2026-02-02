import { FuelPrices, FuelType, VehicleType } from '@/hooks/useFuelPrices';
import { Zap } from 'lucide-react';

interface GasStationPricesProps {
  prices: FuelPrices;
  vehicleType: VehicleType;
  selectedFuel?: FuelType;
  onFuelSelect?: (fuel: FuelType) => void;
}

const fuelLabels: Record<FuelType, { short: string; color: string }> = {
  pb95: { short: 'Pb95', color: 'bg-emerald-600' },
  pb98: { short: 'Pb98', color: 'bg-blue-600' },
  diesel: { short: 'ON', color: 'bg-amber-600' },
  lpg: { short: 'LPG', color: 'bg-purple-600' },
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
      <div className="bg-card border border-border rounded-xl p-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">
            Średnie ceny ({formatDate(prices.lastUpdated)}):
          </span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-success/10 px-2 py-1 rounded">
              <Zap className="w-3 h-3 text-success" />
              <span className="text-xs font-bold text-success">DC: ~1-2 zł</span>
            </div>
            <div className="flex items-center gap-1.5 bg-success/10 px-2 py-1 rounded">
              <span className="text-xs font-bold text-success">Dom: ~0.65 zł</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-zinc-900 to-zinc-800 border border-zinc-700 rounded-xl p-3 shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
          Średnie ceny paliw • {formatDate(prices.lastUpdated)}
        </span>
      </div>
      
      <div className="grid grid-cols-4 gap-1.5">
        {(Object.keys(fuelLabels) as FuelType[]).map((fuel) => {
          const isSelected = selectedFuel === fuel;
          const { short, color } = fuelLabels[fuel];
          const price = prices[fuel];
          
          return (
            <button
              key={fuel}
              type="button"
              onClick={() => onFuelSelect?.(fuel)}
              className={`relative flex flex-col items-center p-2 rounded-lg transition-all ${
                isSelected 
                  ? 'ring-2 ring-primary ring-offset-1 ring-offset-zinc-900 scale-105' 
                  : 'hover:bg-zinc-700/50'
              }`}
            >
              {/* Fuel label badge */}
              <div className={`${color} text-white text-[10px] font-bold px-2 py-0.5 rounded-sm mb-1 shadow-md`}>
                {short}
              </div>
              
              {/* Price display - gas station LED style */}
              <div className="bg-black/80 px-2 py-1 rounded border border-zinc-600">
                <span className="font-mono text-base font-bold text-amber-400 tracking-tight">
                  {price.toFixed(2)}
                </span>
              </div>
              
              <span className="text-[9px] text-zinc-500 mt-0.5">zł/l</span>
            </button>
          );
        })}
      </div>
      
      <p className="text-[9px] text-zinc-500 text-center mt-2">
        Kliknij cenę aby wybrać paliwo • Źródło: e-petrol.pl
      </p>
    </div>
  );
};
