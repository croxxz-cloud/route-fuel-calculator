import { useState, useEffect } from 'react';
import { LocationInput } from './LocationInput';
import { FuelTypeSelect, FuelType, getDefaultPrice } from './FuelTypeSelect';
import { ConsumptionHelper } from './ConsumptionHelper';
import { ResultCard } from './ResultCard';
import { FuelComparison } from './FuelComparison';
import { ExampleRoutes } from './ExampleRoutes';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { 
  Fuel, 
  Route, 
  Calculator, 
  ArrowRight, 
  Loader2,
  Car,
  Banknote,
  RotateCcw,
  Edit3
} from 'lucide-react';

interface Coordinates {
  lat: number;
  lon: number;
}

export const FuelCalculator = () => {
  const [pointA, setPointA] = useState('');
  const [pointB, setPointB] = useState('');
  const [coordsA, setCoordsA] = useState<Coordinates | null>(null);
  const [coordsB, setCoordsB] = useState<Coordinates | null>(null);
  const [autoDistance, setAutoDistance] = useState<number | null>(null);
  const [manualDistance, setManualDistance] = useState('');
  const [useManualDistance, setUseManualDistance] = useState(false);
  const [roundTrip, setRoundTrip] = useState(false);
  const [fuelType, setFuelType] = useState<FuelType>('pb95');
  const [fuelConsumption, setFuelConsumption] = useState('7');
  const [fuelPrice, setFuelPrice] = useState('6.50');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [cost, setCost] = useState<number | null>(null);

  const distance = useManualDistance 
    ? (parseFloat(manualDistance) || null)
    : autoDistance;

  const effectiveDistance = distance ? (roundTrip ? distance * 2 : distance) : null;

  // Update price when fuel type changes
  useEffect(() => {
    setFuelPrice(getDefaultPrice(fuelType));
  }, [fuelType]);

  const fetchDistance = async () => {
    if (!coordsA || !coordsB) return;

    setIsCalculatingDistance(true);
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${coordsA.lon},${coordsA.lat};${coordsB.lon},${coordsB.lat}?overview=false`
      );
      const data = await response.json();
      
      if (data.routes && data.routes.length > 0) {
        const distanceInKm = data.routes[0].distance / 1000;
        setAutoDistance(Math.round(distanceInKm * 10) / 10);
      }
    } catch (error) {
      console.error('Error fetching distance:', error);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  useEffect(() => {
    if (coordsA && coordsB && !useManualDistance) {
      fetchDistance();
    }
  }, [coordsA, coordsB, useManualDistance]);

  useEffect(() => {
    if (effectiveDistance && fuelConsumption && fuelPrice) {
      const consumption = parseFloat(fuelConsumption);
      const price = parseFloat(fuelPrice);
      
      if (!isNaN(consumption) && !isNaN(price) && consumption > 0 && price > 0) {
        const totalCost = (effectiveDistance / 100) * consumption * price;
        setCost(Math.round(totalCost * 100) / 100);
      } else {
        setCost(null);
      }
    } else {
      setCost(null);
    }
  }, [effectiveDistance, fuelConsumption, fuelPrice]);

  const handleExampleRouteSelect = (from: string, to: string) => {
    setUseManualDistance(false);
    setPointA(from);
    setPointB(to);
    // Trigger location search
    setCoordsA(null);
    setCoordsB(null);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 animate-float">
          <Fuel className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="gradient-text">Kalkulator Kosztów Przejazdu</span>
        </h1>
        <p className="text-muted-foreground">
          Oblicz ile zapłacisz za paliwo na trasie A → B
        </p>
      </div>

      {/* Main Card */}
      <div className="glass-card p-6 md:p-8 animate-slide-up">
        {/* Distance Mode Toggle */}
        <div className="flex items-center justify-between mb-6 p-4 bg-secondary/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Edit3 className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Własny dystans</span>
          </div>
          <Switch
            checked={useManualDistance}
            onCheckedChange={setUseManualDistance}
          />
        </div>

        {!useManualDistance ? (
          /* Route Section */
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Route className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Trasa samochodowa (A → B)</h2>
            </div>

            <LocationInput
              label="Punkt startowy (A)"
              value={pointA}
              onChange={setPointA}
              onLocationSelect={(lat, lon) => setCoordsA({ lat, lon })}
              placeholder="np. Warszawa"
            />

            <div className="flex justify-center my-2">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-primary rotate-90" />
              </div>
            </div>

            <LocationInput
              label="Punkt docelowy (B)"
              value={pointB}
              onChange={setPointB}
              onLocationSelect={(lat, lon) => setCoordsB({ lat, lon })}
              placeholder="np. Kraków"
            />

            {/* Distance Display */}
            {(isCalculatingDistance || autoDistance !== null) && (
              <div className="bg-secondary/50 rounded-xl p-4 animate-scale-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">Dystans trasy</span>
                  </div>
                  {isCalculatingDistance ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <span className="text-xl font-bold text-foreground">
                      {autoDistance} km
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Manual Distance Input */
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Route className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Dystans</h2>
            </div>
            <div className="relative">
              <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
              <Input
                type="number"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                placeholder="Wpisz dystans w km"
                className="pl-12"
                min="0"
              />
            </div>
          </div>
        )}

        {/* Round Trip Toggle */}
        <div className="flex items-center justify-between mb-6 p-4 bg-secondary/30 rounded-xl">
          <div className="flex items-center gap-3">
            <RotateCcw className="w-5 h-5 text-primary" />
            <div>
              <span className="text-sm font-medium text-foreground">W obie strony</span>
              <p className="text-xs text-muted-foreground">Podwój dystans (tam i z powrotem)</p>
            </div>
          </div>
          <Switch
            checked={roundTrip}
            onCheckedChange={setRoundTrip}
          />
        </div>

        {/* Round Trip Distance Display */}
        {roundTrip && distance && (
          <div className="bg-primary/10 rounded-xl p-4 mb-6 animate-fade-in text-center">
            <div className="flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">
                Trasa w obie strony: <span className="text-primary font-bold">{effectiveDistance} km</span>
              </span>
            </div>
          </div>
        )}

        {/* Parameters Section */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Parametry</h2>
          </div>

          {/* Fuel Type */}
          <FuelTypeSelect value={fuelType} onChange={setFuelType} />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Spalanie (L/100km)
              </label>
              <div className="relative">
                <Fuel className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  type="number"
                  value={fuelConsumption}
                  onChange={(e) => setFuelConsumption(e.target.value)}
                  placeholder="7.0"
                  className="pl-12"
                  step="0.1"
                  min="0"
                />
              </div>
              <ConsumptionHelper onSelect={setFuelConsumption} />
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Cena paliwa (zł/L)
              </label>
              <div className="relative">
                <Banknote className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                <Input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="6.50"
                  className="pl-12"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Result Section */}
        {cost !== null && effectiveDistance !== null && (
          <>
            <ResultCard
              cost={cost}
              distance={effectiveDistance}
              consumption={parseFloat(fuelConsumption) || 0}
              fuelPrice={parseFloat(fuelPrice) || 0}
              fuelType={fuelType}
              isRoundTrip={roundTrip}
            />
            <FuelComparison 
              distance={effectiveDistance} 
              consumption={parseFloat(fuelConsumption) || 7}
            />
          </>
        )}

        {/* Info */}
        {!cost && !isCalculatingDistance && (
          <div className="text-center py-6 text-muted-foreground text-sm">
            {useManualDistance 
              ? 'Wpisz dystans, aby obliczyć koszt podróży'
              : 'Wybierz punkty A i B, aby obliczyć koszt podróży'
            }
          </div>
        )}
      </div>

      {/* Example Routes */}
      {!useManualDistance && (
        <ExampleRoutes onSelect={handleExampleRouteSelect} />
      )}

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in">
        © OpenStreetMap contributors • Wyniki są przybliżone
      </p>
    </div>
  );
};
