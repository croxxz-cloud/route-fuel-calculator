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
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-semibold mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Aktualizacja: Luty 2026</span>
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
          Kalkulator Kosztów Przejazdu {vehicleType === 'electric' ? '⚡' : '🚗'}
        </h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Oblicz ile zapłacisz za {vehicleType === 'electric' ? 'energię' : 'paliwo'} na trasie.
        </p>
      </div>

      {/* ═══ MAIN CALCULATOR CARD ═══ */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden mb-6">

        {/* ── Wybierz tryb + route/distance ── */}
        <div className="p-4 md:p-5 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block text-center">Wybierz tryb</span>
          <div className="flex gap-2 justify-center mb-4">
            <button
              onClick={() => setMode('route')}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === 'route'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <ArrowRight className="w-4 h-4" />
              Trasa A → B
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                mode === 'manual'
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              Własny dystans
            </button>
          </div>

          {/* Route / Distance inline */}
          {mode === 'route' ? (
            <div className="space-y-3">
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-3 items-end">
                <LocationInput
                  label="Skąd"
                  value={pointA}
                  onChange={setPointA}
                  onLocationSelect={(lat, lon) => setCoordsA({ lat, lon })}
                  placeholder="np. Warszawa"
                />
                <div className="flex justify-center md:pb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary md:rotate-0 rotate-90" />
                  </div>
                </div>
                <LocationInput
                  label="Dokąd"
                  value={pointB}
                  onChange={setPointB}
                  onLocationSelect={(lat, lon) => setCoordsB({ lat, lon })}
                  placeholder="np. Kraków"
                />
              </div>

              {(isCalculatingDistance || autoDistance !== null) && (
                <div className="flex items-center justify-center gap-3 py-2.5 bg-primary/5 rounded-xl">
                  <Car className="w-5 h-5 text-primary" />
                  {isCalculatingDistance ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  ) : (
                    <span className="text-xl font-bold text-foreground">
                      {autoDistance} km
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-3">
              <Car className="w-5 h-5 text-primary flex-shrink-0" />
              <Input
                type="number"
                value={manualDistance}
                onChange={(e) => setManualDistance(e.target.value)}
                placeholder="Wpisz dystans"
                className="h-11 text-base max-w-[180px] text-center border-foreground/30 bg-background text-foreground"
                min="0"
              />
              <span className="text-sm text-muted-foreground font-medium">km</span>
            </div>
          )}
        </div>

        {/* ── Typ pojazdu ── */}
        <div className="p-4 md:p-5 border-b border-border">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block text-center">Typ pojazdu</span>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => setVehicleType('fuel')}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                vehicleType === 'fuel'
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Car className="w-4 h-4" />
              Spalinowy
            </button>
            <button
              onClick={() => setVehicleType('electric')}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                vehicleType === 'electric'
                  ? 'bg-foreground text-background shadow-md'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Zap className="w-4 h-4" />
              Elektryczny
            </button>
          </div>
        </div>

        {/* ── Fuel/Energy config ── */}
        <div className="p-4 md:p-5 border-b border-border">
          <div className="max-w-md mx-auto space-y-3">
            {vehicleType === 'fuel' ? (
              <>
                <GasStationPrices 
                  prices={prices} 
                  vehicleType={vehicleType}
                  selectedFuel={fuelType}
                  onFuelSelect={setFuelType}
                />

                {/* Consumption */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Spalanie</label>
                    <ConsumptionHelper onSelect={setFuelConsumption} fuelType={fuelType} />
                  </div>
                  <div className="relative">
                    <Fuel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                    <Input
                      type="number"
                      value={fuelConsumption}
                      onChange={(e) => setFuelConsumption(e.target.value)}
                      placeholder="7.0"
                      className="pl-10 pr-20 h-10 border-foreground/30 bg-background text-foreground"
                      step="0.1"
                      min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/60 font-medium">L/100km</span>
                  </div>
                </div>

                {/* Fuel price */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">Cena paliwa</label>
                    <span className="text-[11px] text-muted-foreground">lub wpisz własną</span>
                  </div>
                  <div className={`relative transition-all duration-500 rounded-md ${
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
                      className="pl-10 pr-14 h-10 border-foreground/30 bg-background text-foreground"
                      step="0.01"
                      min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/60 font-medium">zł/L</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <GasStationPrices 
                  prices={prices} 
                  vehicleType={vehicleType}
                  selectedFuel={fuelType}
                  onFuelSelect={setFuelType}
                />

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Zużycie energii</label>
                  <div className="relative">
                    <Battery className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                    <Input
                      type="number"
                      value={electricConsumption}
                      onChange={(e) => setElectricConsumption(e.target.value)}
                      placeholder="18"
                      className="pl-10 pr-24 h-10 border-foreground/30 bg-background text-foreground"
                      step="0.1"
                      min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/60 font-medium">kWh/100km</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Typowo 15-25 kWh/100km</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Cena prądu</label>
                  <div className="relative">
                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-success" />
                    <Input
                      type="number"
                      value={electricPrice}
                      onChange={(e) => setElectricPrice(e.target.value)}
                      placeholder="0.89"
                      className="pl-10 pr-16 h-10 border-foreground/30 bg-background text-foreground"
                      step="0.01"
                      min="0"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-foreground/60 font-medium">zł/kWh</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">DC: ~1-2 zł, dom: ~0.65 zł</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Row 4: Options bar ── */}
        <div className="px-4 md:px-6 py-3 border-b border-border bg-muted/30 flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <Switch checked={roundTrip} onCheckedChange={setRoundTrip} />
            <span className="text-sm text-foreground">W obie strony?</span>
            {roundTrip && distance && (
              <span className="text-xs text-primary font-semibold">({effectiveDistance} km)</span>
            )}
          </label>

          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground">Opłaty drogowe</span>
            <div className="relative w-20">
              <Input
                type="number"
                value={tollCosts}
                onChange={(e) => setTollCosts(e.target.value)}
                placeholder="0"
                className="h-8 text-sm pr-7"
                step="1"
                min="0"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">zł</span>
            </div>
          </div>
        </div>

        {/* ── Row 5: CTA ── */}
        <div className="p-5 md:p-8">
          <Button
            onClick={handleCalculate}
            disabled={!canCalculate}
            className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl rounded-2xl transition-all hover:shadow-2xl active:scale-[0.99]"
          >
            <Calculator className="w-7 h-7 mr-3" />
            Policz koszt trasy
          </Button>
        </div>
      </div>

      {/* ═══ RESULTS ═══ */}
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

      {/* Example Routes */}
      {mode === 'route' && <ExampleRoutes onSelect={handleExampleRouteSelect} />}

      <InfoBoxes />
    </div>
  );
};
