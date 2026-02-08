import { Fuel, Zap, ArrowLeftRight } from 'lucide-react';
import { getFuelPrices } from '@/hooks/useFuelPrices';

interface FuelVsElectricComparisonProps {
  distance: number;
  fuelConsumption: number;
  fuelPrice: number;
  fuelType: string;
}

const fuelLabels: Record<string, string> = {
  pb95: 'Pb95',
  pb98: 'Pb98',
  diesel: 'Diesel',
  lpg: 'LPG',
};

export const FuelVsElectricComparison = ({
  distance,
  fuelConsumption,
  fuelPrice,
  fuelType,
}: FuelVsElectricComparisonProps) => {
  const prices = getFuelPrices();

  const fuelCost = (distance / 100) * fuelConsumption * fuelPrice;
  // Typowe EV: 18 kWh/100km, ładowanie DC
  const evConsumption = 18;
  const evPrice = prices.electric;
  const evCost = (distance / 100) * evConsumption * evPrice;

  const diff = fuelCost - evCost;
  const cheaperLabel = diff > 0 ? 'elektryczny' : 'spalinowy';
  const savings = Math.abs(diff);
  const savingsPercent = fuelCost > 0 ? Math.round((savings / Math.max(fuelCost, evCost)) * 100) : 0;

  return (
    <div className="bg-secondary/30 rounded-xl p-5 mt-4">
      <div className="flex items-center gap-2 mb-4">
        <ArrowLeftRight className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Spalinowy vs elektryczny</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        {/* Fuel card */}
        <div className="bg-background/60 border border-border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Fuel className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground">
              {fuelLabels[fuelType] || 'Paliwo'}
            </span>
          </div>
          <p className="text-xl font-bold text-foreground">{fuelCost.toFixed(0)} zł</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {fuelConsumption} L/100km × {fuelPrice} zł/L
          </p>
        </div>

        {/* EV card */}
        <div className="bg-background/60 border border-border rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1.5 mb-2">
            <Zap className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-muted-foreground">Elektryczny</span>
          </div>
          <p className="text-xl font-bold text-foreground">{evCost.toFixed(0)} zł</p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {evConsumption} kWh/100km × {evPrice} zł/kWh
          </p>
        </div>
      </div>

      {/* Difference */}
      <div className={`rounded-lg p-3 text-center ${diff > 0 ? 'bg-success/10 border border-success/20' : 'bg-primary/10 border border-primary/20'}`}>
        <p className="text-sm text-foreground">
          <strong className={diff > 0 ? 'text-success' : 'text-primary'}>
            {savings.toFixed(0)} zł taniej
          </strong>
          {' '}({savingsPercent}%) — {cheaperLabel}
        </p>
      </div>

      <p className="text-[10px] text-muted-foreground mt-2">
        EV: typowe 18 kWh/100km, ładowanie DC ({evPrice} zł/kWh)
      </p>
    </div>
  );
};
