import { useState, useEffect } from 'react';
import { LocationInput } from './LocationInput';
import { FuelType } from './FuelTypeSelect';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { TollCostsInput } from './TollCostsInput';
import { ConsumptionHelper } from './ConsumptionHelper';
import { ResultCard } from './ResultCard';
import { FuelComparison } from './FuelComparison';
import { FuelVsElectricComparison } from './FuelVsElectricComparison';
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
  Battery
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
  
  const { prices } = useFuelPrices();

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

      {/* Main Calculator Grid */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-4 lg:gap-6">
        {/* Left Column - Route/Distance */}
        <div className="space-y-3 lg:space-y-4">
          {/* Calculator Mode */}
          <div className="bg-card border border-border rounded-xl p-4">
            <label className="text-xs font-bold text-foreground mb-2 block">
              Wybierz tryb obliczeń:
            </label>
            <CalculatorModeSelector mode={mode} onChange={setMode} />

            {mode === 'route' ? (
              <div className="space-y-3 mt-3">
                <LocationInput
                  label="Punkt startowy (A)"
                  value={pointA}
                  onChange={setPointA}
                  onLocationSelect={(lat, lon) => setCoordsA({ lat, lon })}
                  placeholder="np. Warszawa"
                />

                <div className="flex justify-center">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center">
                    <ArrowRight className="w-3 h-3 text-primary rotate-90" />
                  </div>
                </div>

                <LocationInput
                  label="Punkt docelowy (B)"
                  value={pointB}
                  onChange={setPointB}
                  onLocationSelect={(lat, lon) => setCoordsB({ lat, lon })}
                  placeholder="np. Kraków"
                />

                {(isCalculatingDistance || autoDistance !== null) && (
                  <div className="bg-input rounded-lg p-3 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Dystans</span>
                      </div>
                      {isCalculatingDistance ? (
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                      ) : (
                        <span className="text-sm font-bold text-foreground">
                          {autoDistance} km
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <label className="block text-xs font-medium text-muted-foreground mb-2">
                  Dystans (km)
                </label>
                <div className="relative">
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

          {/* Round Trip + Tolls - Combined compact */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium text-foreground">W obie strony</span>
              </div>
              <Switch checked={roundTrip} onCheckedChange={setRoundTrip} />
            </div>
            
            {roundTrip && distance && (
              <div className="text-center py-1 border-t border-border">
                <span className="text-xs text-muted-foreground">Razem: </span>
                <span className="text-primary font-bold text-sm">{effectiveDistance} km</span>
              </div>
            )}

            <TollCostsInput value={tollCosts} onChange={setTollCosts} compact />
          </div>

          {/* Mobile: Popularne trasy - MOVED to after results */}
        </div>

        {/* Right Column - Parameters & Results */}
        <div className="space-y-3 lg:space-y-4">
          {/* Desktop only: Vehicle Type + Gas Station Prices */}
          <div className="hidden lg:block space-y-3">
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

          {/* Parameters Card - Fuel + Consumption combined */}
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-sm text-foreground">Parametry</h2>
            </div>

            {vehicleType === 'fuel' ? (
              <div className="grid grid-cols-2 gap-3">
                {/* Consumption */}
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
                  <ConsumptionHelper onSelect={setFuelConsumption} />
                </div>

                {/* Fuel Price */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                    Cena paliwa (zł/L)
                  </label>
                  <div className="relative">
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
                  <p className="text-[10px] text-muted-foreground mt-1">
                    Możesz wpisać własną cenę
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
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

            {/* Calculate Button */}
            <Button
              onClick={handleCalculate}
              disabled={!canCalculate}
              className="w-full mt-4 h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Policz koszt trasy
            </Button>
          </div>

          {/* Results Section */}
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
                  <>
                    <FuelComparison 
                      distance={effectiveDistance} 
                      consumption={parseFloat(fuelConsumption) || 7}
                    />
                    <FuelVsElectricComparison
                      distance={effectiveDistance}
                      fuelConsumption={parseFloat(fuelConsumption) || 7}
                      fuelPrice={parseFloat(fuelPrice) || 5.89}
                      fuelType={fuelType}
                    />
                  </>
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

          {/* Example Routes - Desktop and Mobile after results */}
          <div className="hidden lg:block">
            {mode === 'route' && <ExampleRoutes onSelect={handleExampleRouteSelect} />}
          </div>
        </div>
      </div>

      {/* Mobile: Popularne trasy - after everything */}
      <div className="lg:hidden mt-4">
        {mode === 'route' && <ExampleRoutes onSelect={handleExampleRouteSelect} />}
      </div>

      {/* Info Boxes - without EV section on mobile handled via component */}
      <InfoBoxes />
    </div>
  );
};
