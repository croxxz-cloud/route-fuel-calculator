import { Car, Fuel, Banknote, RotateCcw } from 'lucide-react';
import { PassengerSplit } from './PassengerSplit';

interface ResultCardProps {
  cost: number;
  distance: number;
  consumption: number;
  fuelPrice: number;
  fuelType: string;
  isRoundTrip: boolean;
}

const fuelLabels: Record<string, string> = {
  pb95: 'Pb95',
  pb98: 'Pb98',
  diesel: 'Diesel',
  lpg: 'LPG',
};

export const ResultCard = ({ 
  cost, 
  distance, 
  consumption, 
  fuelPrice,
  fuelType,
  isRoundTrip 
}: ResultCardProps) => {
  const fuelAmount = (distance / 100) * consumption;

  return (
    <div className="result-glow bg-gradient-to-br from-primary/20 to-accent/10 rounded-xl p-6 animate-scale-in">
      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Car className="w-6 h-6 text-primary" />
          <p className="text-muted-foreground">
            {isRoundTrip ? 'Koszt przejazdu (tam i z powrotem)' : 'Koszt przejazdu'}
          </p>
        </div>
        <p className="text-4xl md:text-5xl font-bold gradient-text mb-1">
          {cost.toFixed(2)} zł
        </p>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {isRoundTrip && <RotateCcw className="w-3 h-3 text-primary" />}
            <span className="text-xs text-muted-foreground">Dystans</span>
          </div>
          <p className="font-semibold text-foreground">
            {distance} km
            {isRoundTrip && <span className="text-xs text-muted-foreground ml-1">(w obie strony)</span>}
          </p>
        </div>
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Fuel className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Ilość paliwa</span>
          </div>
          <p className="font-semibold text-foreground">{fuelAmount.toFixed(1)} L</p>
        </div>
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <span className="text-xs text-muted-foreground">Spalanie</span>
          <p className="font-semibold text-foreground">{consumption} L/100km</p>
        </div>
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Banknote className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Cena {fuelLabels[fuelType]}</span>
          </div>
          <p className="font-semibold text-foreground">{fuelPrice} zł/L</p>
        </div>
      </div>

      {/* Attribution */}
      <p className="text-xs text-muted-foreground text-center border-t border-border/30 pt-3">
        Obliczono na podstawie realnej trasy drogowej (OpenStreetMap)
      </p>

      {/* Passenger Split */}
      <PassengerSplit totalCost={cost} />
    </div>
  );
};
