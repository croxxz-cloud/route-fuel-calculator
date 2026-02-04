import { Car, Fuel, Banknote, RotateCcw, Zap, Battery, Receipt, Clock } from 'lucide-react';
import { PassengerSplit } from './PassengerSplit';
import { VehicleType } from '@/hooks/useFuelPrices';
import { formatDuration, formatTravelTimeFromDistanceKm } from '@/lib/travelTime';

interface ResultCardProps {
  cost: number;
  distance: number;
  consumption: number;
  energyPrice: number;
  fuelType: string;
  vehicleType: VehicleType;
  isRoundTrip: boolean;
  tollCosts: number;
  /** Realny czas z API (sekundy). Jeśli brak, pokażemy szacunek z dystansu. */
  durationSeconds?: number;
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
  energyPrice,
  fuelType,
  vehicleType,
  isRoundTrip,
  tollCosts,
  durationSeconds,
}: ResultCardProps) => {
  const energyAmount = (distance / 100) * consumption;
  const isElectric = vehicleType === 'electric';
  const energyCost = cost - tollCosts;
  const travelTimeLabel = durationSeconds
    ? formatDuration(durationSeconds)
    : formatTravelTimeFromDistanceKm(distance, 90);

  return (
    <div className={`result-glow rounded-xl p-6 animate-scale-in ${
      isElectric 
        ? 'bg-gradient-to-br from-success/20 to-accent/10' 
        : 'bg-gradient-to-br from-primary/20 to-accent/10'
    }`}>
      {/* Main Result */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          {isElectric ? (
            <Zap className="w-6 h-6 text-success" />
          ) : (
            <Car className="w-6 h-6 text-primary" />
          )}
          <p className="text-muted-foreground">
            {isRoundTrip ? 'Koszt przejazdu (tam i z powrotem)' : 'Koszt przejazdu'}
          </p>
        </div>
        <p className="text-4xl md:text-5xl font-bold gradient-text mb-1">
          {cost.toFixed(2)} zł
        </p>
        {tollCosts > 0 && (
          <p className="text-sm text-muted-foreground">
            w tym opłaty drogowe: {tollCosts.toFixed(2)} zł
          </p>
        )}
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
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Czas przejazdu</span>
          </div>
          <p className="font-semibold text-foreground">
            {travelTimeLabel}
          </p>
          <p className="text-[10px] text-muted-foreground">bez postojów</p>
        </div>
      </div>

      {/* Details Grid - Row 2 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {isElectric ? (
              <Battery className="w-3 h-3 text-success" />
            ) : (
              <Fuel className="w-3 h-3 text-primary" />
            )}
            <span className="text-xs text-muted-foreground">
              {isElectric ? 'Energia' : 'Ilość paliwa'}
            </span>
          </div>
          <p className="font-semibold text-foreground">
            {energyAmount.toFixed(1)} {isElectric ? 'kWh' : 'L'}
          </p>
        </div>
        <div className="bg-background/50 rounded-lg p-3 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            {isElectric ? (
              <Zap className="w-3 h-3 text-success" />
            ) : (
              <Banknote className="w-3 h-3 text-primary" />
            )}
            <span className="text-xs text-muted-foreground">
              {isElectric ? 'Cena energii' : `Cena ${fuelLabels[fuelType]}`}
            </span>
          </div>
          <p className="font-semibold text-foreground">
            {energyPrice} zł/{isElectric ? 'kWh' : 'L'}
          </p>
        </div>
      </div>

      {/* Toll Costs Breakdown */}
      {tollCosts > 0 && (
        <div className="bg-background/50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">Opłaty drogowe</span>
            </div>
            <span className="font-semibold text-foreground">{tollCosts.toFixed(2)} zł</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-sm text-muted-foreground">
              {isElectric ? 'Koszt energii' : 'Koszt paliwa'}
            </span>
            <span className="font-semibold text-foreground">{energyCost.toFixed(2)} zł</span>
          </div>
        </div>
      )}

      {/* Attribution */}
      <p className="text-xs text-muted-foreground text-center border-t border-border/30 pt-3">
        Obliczono na podstawie realnej trasy drogowej (OpenStreetMap)
      </p>

      {/* Passenger Split */}
      <PassengerSplit totalCost={cost} />
    </div>
  );
};
