import { TrendingUp, Zap } from 'lucide-react';
import { FuelPrices } from '@/hooks/useFuelPrices';
import { VehicleType } from '@/hooks/useFuelPrices';

interface CurrentPricesBarProps {
  prices: FuelPrices;
  vehicleType: VehicleType;
}

export const CurrentPricesBar = ({ prices, vehicleType }: CurrentPricesBarProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-muted/50 border border-border rounded-xl p-3 mb-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <TrendingUp className="w-3.5 h-3.5 text-primary" />
          <span>Średnie ceny ({formatDate(prices.lastUpdated)}):</span>
        </div>
        
        {vehicleType === 'fuel' ? (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Pb95:</span>
              <span className="text-xs font-semibold text-success">{prices.pb95.toFixed(2)} zł</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Pb98:</span>
              <span className="text-xs font-semibold text-success">{prices.pb98.toFixed(2)} zł</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Diesel:</span>
              <span className="text-xs font-semibold text-success">{prices.diesel.toFixed(2)} zł</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">LPG:</span>
              <span className="text-xs font-semibold text-success">{prices.lpg.toFixed(2)} zł</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-success" />
              <span className="text-xs text-muted-foreground">Stacje DC:</span>
              <span className="text-xs font-semibold text-success">~1.00-2.00 zł/kWh</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Dom:</span>
              <span className="text-xs font-semibold text-success">~0.65 zł/kWh</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
