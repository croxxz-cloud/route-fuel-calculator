import { useState, useEffect, useRef } from 'react';
import { LocationInput } from './LocationInput';
import { FuelType } from './FuelTypeSelect';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { TollCostsInput } from './TollCostsInput';
import { ConsumptionHelper } from './ConsumptionHelper';
import { ResultCard } from './ResultCard';
import { FuelComparison } from './FuelComparison';

import { RouteDetails } from './RouteDetails';
import { ExampleRoutes } from './ExampleRoutes';
import { CalculatorModeSelector, CalculatorMode } from './CalculatorModeSelector';
import { InfoBoxes } from './InfoBoxes';
import { GasStationPrices } from './GasStationPrices';
import { useFuelPrices, VehicleType } from '@/hooks/useFuelPrices';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  Fuel, 
  ArrowRight, 
  Loader2,
  Car,
  Banknote,
  RotateCcw,
  Calculator,
  Sparkles,
  Zap,
  Battery,
  Receipt
} from 'lucide-react';

interface Coordinates {
  lat: number;
  lon: number;
}

export const FuelCalculator = () => {
  const [mode, setMode] = useState<CalculatorMode>('route');
  const [vehicleType, setVehicleType] = useState<VehicleType>('fuel');
  const [pointA, setPointA] = useState('');
  const [pointB, setPointB] = useState('');
  const [coordsA, setCoordsA] = useState<Coordinates | null>(null);
  const [coordsB, setCoordsB] = useState<Coordinates | null>(null);
  const [autoDistance, setAutoDistance] = useState<number | null>(null);
  const [autoDurationSeconds, setAutoDurationSeconds] = useState<number | null>(null);
  const [manualDistance, setManualDistance] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [fuelType, setFuelType] = useState<FuelType>('pb95');
  const [fuelConsumption, setFuelConsumption] = useState('7');
  const [electricConsumption, setElectricConsumption] = useState('18');
  const [fuelPrice, setFuelPrice] = useState('5.89');
  const [electricPrice, setElectricPrice] = useState('0.89');
  const [tollCosts, setTollCosts] = useState('');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [cost, setCost] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [fuelPriceHighlight, setFuelPriceHighlight] = useState(false);
  
  const { prices } = useFuelPrices();

  const CONSUMPTION_MULTIPLIERS: Record<string, number> = {
    pb95: 1.0, pb98: 1.0, diesel: 0.95, lpg: 1.2,
  };
  const prevFuelTypeRef = useRef(fuelType);

  const distance = mode === 'manual'
    ? (parseFloat(manualDistance) || null)
    : autoDistance;

  const durationSeconds = mode === 'route' ? autoDurationSeconds : null;

  const effectiveDistance = distance ? (roundTrip ? distance * 2 : distance) : null;
  const effectiveDurationSeconds = durationSeconds
    ? (roundTrip ? durationSeconds * 2 : durationSeconds)
    : null;

  useEffect(() => {
    if (vehicleType === 'fuel') {
      setFuelPrice(prices[fuelType].toFixed(2));
      // Flash highlight on fuel price field
      setFuelPriceHighlight(true);
      setTimeout(() => setFuelPriceHighlight(false), 500);
      // Auto-adjust consumption based on fuel type multiplier
      const prevMult = CONSUMPTION_MULTIPLIERS[prevFuelTypeRef.current] || 1;
      const newMult = CONSUMPTION_MULTIPLIERS[fuelType] || 1;
      if (prevFuelTypeRef.current !== fuelType) {
        const current = parseFloat(fuelConsumption) || 7;
        const base = current / prevMult;
        setFuelConsumption((base * newMult).toFixed(1));
      }
      prevFuelTypeRef.current = fuelType;
    } else {
      setElectricPrice(prices.electric.toFixed(2));
    }
  }, [fuelType, vehicleType, prices]);

  // OpenRouteService API Key - get yours free at https://openrouteservice.org/dev/#/signup
  const ORS_API_KEY = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjdkZWJiNGYxMTk4YjQ0YWNhN2MwZjA1YzAyYmYwYzg4IiwiaCI6Im11cm11cjY0In0=';

  const fetchDistance = async () => {
    if (!coordsA || !coordsB) return;

    if (!ORS_API_KEY) {
      console.warn('OpenRouteService API key not configured. Using fallback OSRM.');
      // Fallback to OSRM demo (only for testing)
      setIsCalculatingDistance(true);
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${coordsA.lon},${coordsA.lat};${coordsB.lon},${coordsB.lat}?overview=false`
        );
        const data = await response.json();
        if (data.routes && data.routes.length > 0) {
          const distanceInKm = data.routes[0].distance / 1000;
          setAutoDistance(Math.round(distanceInKm * 10) / 10);
          if (typeof data.routes[0].duration === 'number') {
            setAutoDurationSeconds(data.routes[0].duration);
          }
        }
      } catch (error) {
        console.error('Error fetching distance:', error);
      } finally {
        setIsCalculatingDistance(false);
      }
      return;
    }

    setIsCalculatingDistance(true);
    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${ORS_API_KEY}&start=${coordsA.lon},${coordsA.lat}&end=${coordsB.lon},${coordsB.lat}`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const distanceInKm = data.features[0].properties.segments[0].distance / 1000;
        setAutoDistance(Math.round(distanceInKm * 10) / 10);

        const duration = data.features?.[0]?.properties?.segments?.[0]?.duration;
        if (typeof duration === 'number') {
          setAutoDurationSeconds(duration);
        }
      }
    } catch (error) {
      console.error('Error fetching distance from OpenRouteService:', error);
    } finally {
      setIsCalculatingDistance(false);
    }
  };

  useEffect(() => {
    if (coordsA && coordsB && mode === 'route') {
      fetchDistance();
    }
  }, [coordsA, coordsB, mode]);

  useEffect(() => {
    if (effectiveDistance) {
      const tollAmount = parseFloat(tollCosts) || 0;
      
      if (vehicleType === 'fuel') {
        const consumption = parseFloat(fuelConsumption);
        const price = parseFloat(fuelPrice);
        
        if (!isNaN(consumption) && !isNaN(price) && consumption > 0 && price > 0) {
          const fuelCost = (effectiveDistance / 100) * consumption * price;
          setCost(Math.round((fuelCost + tollAmount) * 100) / 100);
        } else {
          setCost(null);
        }
      } else {
        const consumption = parseFloat(electricConsumption);
        const price = parseFloat(electricPrice);
        
        if (!isNaN(consumption) && !isNaN(price) && consumption > 0 && price > 0) {
          const energyCost = (effectiveDistance / 100) * consumption * price;
          setCost(Math.round((energyCost + tollAmount) * 100) / 100);
        } else {
          setCost(null);
        }
      }
    } else {
      setCost(null);
    }
  }, [effectiveDistance, fuelConsumption, fuelPrice, electricConsumption, electricPrice, tollCosts, vehicleType]);

  const handleExampleRouteSelect = (from: string, to: string) => {
    setMode('route');
    setPointA(from);
    setPointB(to);
    setCoordsA(null);
    setCoordsB(null);
    setAutoDurationSeconds(null);
  };

  const handleCalculate = () => {
    setShowResults(true);
    // Scroll to results on mobile
    setTimeout(() => {
      const resultsEl = document.getElementById('results-section');
      if (resultsEl) {
        resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const canCalculate = effectiveDistance !== null && cost !== null;

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Aktualizacja: Luty 2026</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2 flex items-center justify-center gap-3 flex-wrap">
          <span>Kalkulator Kosztów Przejazdu</span>
          <span className="text-xl md:text-2xl">{vehicleType === 'electric' ? '⚡' : '🚗'}</span>
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Oblicz ile zapłacisz za {vehicleType === 'electric' ? 'energię' : 'paliwo'} na trasie.
        </p>
      </div>

      {/* Mobile: Top controls - Vehicle Type + Gas Station Prices */}
      <div className="lg:hidden space-y-3 mb-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <label className="text-xs font-bold text-foreground mb-2 block">
            Wybierz typ pojazdu:
          </label>
          <VehicleTypeSelector value={vehicleType} onChange={setVehicleType} />
        </div>
        
        <GasStationPrices 
          prices={prices} 
          vehicleType={vehicleType}
          selectedFuel={fuelType}
          onFuelSelect={setFuelType}
        />
      </div>

      {/* Calculator Mode - full width above grid */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <label className="text-xs font-bold text-foreground mb-2 block">
          Wybierz tryb obliczeń:
        </label>
        <CalculatorModeSelector mode={mode} onChange={setMode} />
      </div>

      {/* Route/Distance inputs - full width */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-5 mb-4">
        {mode === 'route' ? (
          <div className="space-y-3">
            <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <LocationInput
                label="Punkt startowy (A)"
                value={pointA}
                onChange={setPointA}
                onLocationSelect={(lat, lon) => setCoordsA({ lat, lon })}
                placeholder="np. Warszawa"
              />
              <div className="flex justify-center md:pb-2">
                <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                  <ArrowRight className="w-3 h-3 text-primary md:rotate-0 rotate-90" />
                </div>
              </div>
              <LocationInput
                label="Punkt docelowy (B)"
                value={pointB}
                onChange={setPointB}
                onLocationSelect={(lat, lon) => setCoordsB({ lat, lon })}
                placeholder="np. Kraków"
              />
            </div>

            {(isCalculatingDistance || autoDistance !== null) && (
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Wyznaczony dystans:</span>
                </div>
                {isCalculatingDistance ? (
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                ) : (
                  <span className="text-2xl font-bold text-foreground">
                    {autoDistance} <span className="text-base font-medium text-muted-foreground">km</span>
                  </span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-2">
              Dystans (km)
            </label>
            <div className="relative max-w-sm">
              <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              <Input
                type="number"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                placeholder="Wpisz dystans"
                className="pl-10 h-10"
                min="0"
              />
            </div>
          </div>
        )}
      </div>

      {/* Vehicle Type - full width */}
      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <label className="text-xs font-bold text-foreground mb-2 block">
          Wybierz typ pojazdu:
        </label>
        <VehicleTypeSelector value={vehicleType} onChange={setVehicleType} />
      </div>

      {/* Fuel Selection - centered, compact */}
      <div className="flex justify-center mb-4">
        <div className="w-full max-w-lg">
          <GasStationPrices 
            prices={prices} 
            vehicleType={vehicleType}
            selectedFuel={fuelType}
            onFuelSelect={setFuelType}
          />
        </div>
      </div>

      {/* Parameters - consumption + price side by side */}
      <div className="bg-card border border-border rounded-xl p-4 md:p-5 mb-4">
        {vehicleType === 'fuel' ? (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Spalanie (L/100km)
              </label>
              <div className="relative">
                <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input
                  type="number"
                  value={fuelConsumption}
                  onChange={(e) => setFuelConsumption(e.target.value)}
                  placeholder="7.0"
                  className="pl-10 h-10 text-sm"
                  step="0.1"
                  min="0"
                />
              </div>
              <ConsumptionHelper onSelect={setFuelConsumption} fuelType={fuelType} />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Cena paliwa (zł/L)
              </label>
              <p className="text-[10px] text-primary/70 mb-0.5">lub wpisz własną</p>
              <div className={`relative transition-all duration-500 rounded-lg ${
                fuelPriceHighlight 
                  ? 'ring-2 ring-primary shadow-[0_0_12px_hsl(var(--primary)/0.3)]' 
                  : ''
              }`}>
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="5.89"
                  className="pl-10 h-10 text-sm"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Zużycie (kWh/100km)
              </label>
              <div className="relative">
                <Battery className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                <Input
                  type="number"
                  value={electricConsumption}
                  onChange={(e) => setElectricConsumption(e.target.value)}
                  placeholder="18"
                  className="pl-10 h-10 text-sm"
                  step="0.1"
                  min="0"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">15-25 kWh typowo</p>
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Cena (zł/kWh)
              </label>
              <div className="relative">
                <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                <Input
                  type="number"
                  value={electricPrice}
                  onChange={(e) => setElectricPrice(e.target.value)}
                  placeholder="0.89"
                  className="pl-10 h-10 text-sm"
                  step="0.01"
                  min="0"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">DC: ~1-2zł, dom: ~0.65zł</p>
            </div>
          </div>
        )}

        {/* Extras row */}
        <div className="flex flex-wrap items-center gap-6 mt-4 pt-4 border-t border-border">
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={roundTrip} onCheckedChange={setRoundTrip} />
            <span className="text-sm text-foreground">W obie strony?</span>
            {roundTrip && distance && (
              <span className="text-xs text-primary font-semibold">({effectiveDistance} km)</span>
            )}
          </label>

          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-primary" />
            <span className="text-sm text-foreground">Opłaty drogowe:</span>
            <div className="relative w-24">
              <Input
                type="number"
                value={tollCosts}
                onChange={(e) => setTollCosts(e.target.value)}
                placeholder="0"
                className="h-8 text-sm pr-8"
                step="1"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">zł</span>
            </div>
          </div>
        </div>
      </div>

      {/* BIG Calculate Button */}
      <Button
        onClick={handleCalculate}
        disabled={!canCalculate}
        className="w-full mb-6 h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-xl"
      >
        <Calculator className="w-6 h-6 mr-2" />
        Policz koszt trasy
      </Button>

      {/* Results Section - full width */}
      <div id="results-section">
        {showResults && cost !== null && effectiveDistance !== null ? (
          <>
            <ResultCard
              cost={cost}
              distance={effectiveDistance}
              consumption={vehicleType === 'fuel' ? parseFloat(fuelConsumption) || 0 : parseFloat(electricConsumption) || 0}
              energyPrice={vehicleType === 'fuel' ? parseFloat(fuelPrice) || 0 : parseFloat(electricPrice) || 0}
              fuelType={fuelType}
              vehicleType={vehicleType}
              isRoundTrip={roundTrip}
              tollCosts={parseFloat(tollCosts) || 0}
              durationSeconds={effectiveDurationSeconds ?? undefined}
              routeFrom={mode === 'route' ? pointA : undefined}
              routeTo={mode === 'route' ? pointB : undefined}
            />
            {vehicleType === 'fuel' && (
              <FuelComparison 
                distance={effectiveDistance} 
                consumption={parseFloat(fuelConsumption) || 7}
              />
            )}
            {mode === 'route' && pointA && pointB && (
              <RouteDetails
                from={pointA}
                to={pointB}
                fuelConsumption={vehicleType === 'fuel' ? parseFloat(fuelConsumption) || 7 : parseFloat(electricConsumption) || 18}
                fuelPrice={vehicleType === 'fuel' ? parseFloat(fuelPrice) || 5.89 : parseFloat(electricPrice) || 0.89}
              />
            )}
          </>
        ) : !showResults && canCalculate ? (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
            <Car className="w-10 h-10 text-primary mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              Kliknij <strong className="text-primary">"Policz koszt trasy"</strong> aby zobaczyć wyniki
            </p>
          </div>
        ) : null}
      </div>

      {/* Example Routes - full width */}
      {mode === 'route' && <ExampleRoutes onSelect={handleExampleRouteSelect} />}

      <InfoBoxes />
    </div>
  );
};
