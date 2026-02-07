import { routesData, RouteData } from '@/data/routesData';
import { MapPin, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';

interface RouteDetailsProps {
  from: string;
  to: string;
  fuelConsumption: number;
  fuelPrice: number;
}

/**
 * Try to match user-entered from/to against routesData.
 * Simple substring matching on city names.
 */
function findMatchingRoute(from: string, to: string): RouteData | null {
  const normalize = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const f = normalize(from);
  const t = normalize(to);

  return (
    routesData.find((r) => {
      const rf = normalize(r.from);
      const rt = normalize(r.to);
      return (f.includes(rf) || rf.includes(f)) && (t.includes(rt) || rt.includes(t));
    }) ??
    routesData.find((r) => {
      const rf = normalize(r.from);
      const rt = normalize(r.to);
      return (f.includes(rt) || rt.includes(f)) && (t.includes(rf) || rf.includes(t));
    }) ??
    null
  );
}

export const RouteDetails = ({ from, to, fuelConsumption, fuelPrice }: RouteDetailsProps) => {
  const route = findMatchingRoute(from, to);
  if (!route) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mt-3 animate-fade-in">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-primary" />
        Dostępne warianty trasy {route.from} → {route.to}
      </h3>

      <div className="space-y-2">
        {route.variants.map((variant, i) => {
          const cost = ((variant.distance / 100) * fuelConsumption * fuelPrice);
          const totalWithTolls = route.hasTolls 
            ? cost + route.tollSections.reduce((sum, t) => sum + t.cost, 0) 
            : cost;

          return (
            <div
              key={i}
              className="bg-input border border-border rounded-lg p-3 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="text-sm font-medium text-foreground">{variant.name}</span>
                <span className="text-sm font-bold text-primary whitespace-nowrap">
                  ~{cost.toFixed(0)} zł
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 text-xs text-muted-foreground mb-1.5">
                {variant.via.map((city, j) => (
                  <span key={j} className="flex items-center gap-1">
                    {j > 0 && <ArrowRight className="w-2.5 h-2.5" />}
                    {city}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="font-medium">{variant.distance} km</span>
                <span>•</span>
                <span>{variant.time}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toll info */}
      {route.hasTolls && route.tollSections.length > 0 && (
        <div className="mt-3 bg-destructive/5 border border-destructive/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <span className="text-xs font-semibold text-foreground">Odcinki płatne na tej trasie</span>
          </div>
          <div className="space-y-1">
            {route.tollSections.map((toll, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{toll.name}</span>
                <span className="font-semibold text-foreground">{toll.cost} zł</span>
              </div>
            ))}
            <div className="flex items-center justify-between text-xs border-t border-destructive/20 pt-1 mt-1">
              <span className="font-semibold text-foreground">Suma opłat</span>
              <span className="font-bold text-primary">
                {route.tollSections.reduce((s, t) => s + t.cost, 0)} zł
              </span>
            </div>
          </div>
        </div>
      )}

      {!route.hasTolls && (
        <div className="mt-3 bg-success/5 border border-success/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span className="text-xs font-medium text-foreground">Trasa bezpłatna — brak opłat za autostrady</span>
          </div>
        </div>
      )}

      {route.description && (
        <p className="text-[11px] text-muted-foreground mt-2 italic">{route.description}</p>
      )}
    </div>
  );
};
