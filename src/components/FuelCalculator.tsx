import { useState, useEffect } from 'react';
import { LocationInput } from './LocationInput';
import { FuelTypeSelect, FuelType } from './FuelTypeSelect';
import { VehicleTypeSelector } from './VehicleTypeSelector';
import { TollCostsInput } from './TollCostsInput';
import { ConsumptionHelper } from './ConsumptionHelper';
import { ResultCard } from './ResultCard';
import { FuelComparison } from './FuelComparison';
import { ExampleRoutes } from './ExampleRoutes';
import { CalculatorModeSelector, CalculatorMode } from './CalculatorModeSelector';
import { InfoBoxes } from './InfoBoxes';
import { CurrentPricesBar } from './CurrentPricesBar';
import { useFuelPrices, VehicleType } from '@/hooks/useFuelPrices';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
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
  const [manualDistance, setManualDistance] = useState('');
  const [roundTrip, setRoundTrip] = useState(false);
  const [fuelType, setFuelType] = useState<FuelType>('pb95');
  const [fuelConsumption, setFuelConsumption] = useState('7');
  const [electricConsumption, setElectricConsumption] = useState('18'); // kWh/100km
  const [fuelPrice, setFuelPrice] = useState('5.79');
  const [electricPrice, setElectricPrice] = useState('0.85'); // zł/kWh
  const [tollCosts, setTollCosts] = useState('');
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false);
  const [cost, setCost] = useState<number | null>(null);
  
  const { prices } = useFuelPrices();

  const distance = mode === 'manual' 
    ? (parseFloat(manualDistance) || null)
    : autoDistance;

  const effectiveDistance = distance ? (roundTrip ? distance * 2 : distance) : null;

  // Update price when fuel type changes - use current market prices
  useEffect(() => {
    if (vehicleType === 'fuel') {
      setFuelPrice(prices[fuelType].toFixed(2));
    } else {
      setElectricPrice(prices.electric.toFixed(2));
    }
  }, [fuelType, vehicleType, prices]);

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
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/30 rounded-full text-success text-sm font-semibold mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Aktualizacja: Styczeń 2026</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3 flex items-center justify-center gap-3 flex-wrap">
          <span>Kalkulator Kosztów Przejazdu</span>
          <span className="text-2xl">{vehicleType === 'electric' ? '⚡' : '🚗'}</span>
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Oblicz ile zapłacisz za {vehicleType === 'electric' ? 'energię' : 'paliwo'} na trasie. Wybierz trasę A → B lub wpisz własny dystans.
        </p>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        {/* Left Column - Mode & Inputs */}
        <div className="space-y-4">
          {/* Calculator Mode Selector */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Wybierz tryb obliczania:
            </label>
            <CalculatorModeSelector mode={mode} onChange={setMode} />

            {mode === 'route' ? (
              /* Route Mode */
              <div className="space-y-4">
                <LocationInput
                  label="Punkt startowy (A)"
                  value={pointA}
                  onChange={setPointA}
                  onLocationSelect={(lat, lon) => setCoordsA({ lat, lon })}
                  placeholder="np. Warszawa"
                />

                <div className="flex justify-center">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-primary rotate-90" />
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
                  <div className="bg-input rounded-xl p-4 border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Dystans trasy</span>
                      </div>
                      {isCalculatingDistance ? (
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                      ) : (
                        <span className="text-lg font-bold text-foreground">
                          {autoDistance} km
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Manual Distance Mode */
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Dystans (km)
                </label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
                  <Input
                    type="number"
                    value={manualDistance}
                    onChange={(e) => setManualDistance(e.target.value)}
                    placeholder="Wpisz dystans w km"
                    className="pl-12 h-12 text-lg"
                    min="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Round Trip Toggle */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-sm font-medium text-foreground block">W obie strony</span>
                  <p className="text-xs text-muted-foreground">Podwój dystans (tam i z powrotem)</p>
                </div>
              </div>
              <Switch
                checked={roundTrip}
                onCheckedChange={setRoundTrip}
              />
            </div>
            
            {roundTrip && distance && (
              <div className="mt-4 pt-4 border-t border-border text-center">
                <span className="text-sm text-muted-foreground">Trasa w obie strony: </span>
                <span className="text-primary font-bold">{effectiveDistance} km</span>
              </div>
            )}
          </div>

          {/* Toll Costs */}
          <TollCostsInput value={tollCosts} onChange={setTollCosts} />

          {/* Example Routes */}
          {mode === 'route' && (
            <ExampleRoutes onSelect={handleExampleRouteSelect} />
          )}
        </div>

        {/* Right Column - Parameters & Results */}
        <div className="space-y-4">
          {/* Vehicle Type Selector */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <label className="text-sm font-medium text-muted-foreground mb-3 block">
              Typ pojazdu:
            </label>
            <VehicleTypeSelector value={vehicleType} onChange={setVehicleType} />
          </div>

          {/* Current Prices Bar */}
          <CurrentPricesBar prices={prices} vehicleType={vehicleType} />

          {/* Parameters Card */}
          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground">Parametry</h2>
            </div>

            {vehicleType === 'fuel' ? (
              /* Fuel Vehicle Parameters */
              <div className="grid sm:grid-cols-3 gap-4">
                {/* Fuel Type */}
                <div>
                  <FuelTypeSelect value={fuelType} onChange={setFuelType} />
                </div>

                {/* Consumption */}
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
                      className="pl-12 h-12"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <ConsumptionHelper onSelect={setFuelConsumption} />
                </div>

                {/* Fuel Price */}
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
                      placeholder="5.79"
                      className="pl-12 h-12"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Możesz wpisać własną cenę ze stacji
                  </p>
                </div>
              </div>
            ) : (
              /* Electric Vehicle Parameters */
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Consumption */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Zużycie energii (kWh/100km)
                  </label>
                  <div className="relative">
                    <Battery className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                    <Input
                      type="number"
                      value={electricConsumption}
                      onChange={(e) => setElectricConsumption(e.target.value)}
                      placeholder="18"
                      className="pl-12 h-12"
                      step="0.1"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Typowo 15-25 kWh/100km
                  </p>
                </div>

                {/* Electric Price */}
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Cena energii (zł/kWh)
                  </label>
                  <div className="relative">
                    <Zap className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-success" />
                    <Input
                      type="number"
                      value={electricPrice}
                      onChange={(e) => setElectricPrice(e.target.value)}
                      placeholder="0.85"
                      className="pl-12 h-12"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Stacje DC: ~1-2 zł, dom: ~0.65 zł
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {cost !== null && effectiveDistance !== null ? (
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
              />
              {vehicleType === 'fuel' && (
                <FuelComparison 
                  distance={effectiveDistance} 
                  consumption={parseFloat(fuelConsumption) || 7}
                />
              )}
            </>
          ) : (
            /* Empty State */
            <div className="bg-card border border-border rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                {vehicleType === 'electric' ? (
                  <Zap className="w-8 h-8 text-success" />
                ) : (
                  <Car className="w-8 h-8 text-primary" />
                )}
              </div>
              <h3 className="font-semibold text-foreground mb-2">Oblicz koszt przejazdu</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                {mode === 'route' 
                  ? 'Wybierz punkt startowy i docelowy, aby obliczyć koszt podróży na podstawie realnej trasy.'
                  : 'Wpisz dystans w kilometrach, aby obliczyć koszt przejazdu.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info Boxes */}
      <InfoBoxes prices={prices} />
    </div>
  );
};
