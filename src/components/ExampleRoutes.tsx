import { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
interface ExampleRoutesProps {
  onSelect: (from: string, to: string) => void;
}

const routes = [
  // Trasy krajowe
  { from: 'Warszawa', to: 'Kraków', distance: 294 },
  { from: 'Gdańsk', to: 'Warszawa', distance: 340 },
  { from: 'Wrocław', to: 'Poznań', distance: 166 },
  { from: 'Katowice', to: 'Łódź', distance: 194 },
  { from: 'Poznań', to: 'Warszawa', distance: 310 },
  { from: 'Lublin', to: 'Kraków', distance: 280 },
  { from: 'Szczecin', to: 'Gdańsk', distance: 350 },
  { from: 'Białystok', to: 'Warszawa', distance: 195 },
  // Trasy międzynarodowe
  { from: 'Kraków', to: 'Praga', distance: 535 },
  { from: 'Warszawa', to: 'Berlin', distance: 575 },
  { from: 'Kraków', to: 'Wiedeń', distance: 410 },
  { from: 'Wrocław', to: 'Drezno', distance: 290 },
];

export const ExampleRoutes = ({ onSelect }: ExampleRoutesProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleRoutes = showAll ? routes : routes.slice(0, 6);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Popularne trasy:
      </h3>
      <div className="space-y-2">
        {visibleRoutes.map((route) => (
          <button
            key={`${route.from}-${route.to}`}
            onClick={() => onSelect(route.from, route.to)}
            className="w-full flex items-center gap-3 p-3 bg-input hover:bg-secondary/80 border border-border hover:border-primary/30 rounded-xl transition-all group text-left"
          >
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-sm text-foreground truncate">{route.from}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground truncate">{route.to}</span>
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{route.distance} km</span>
          </button>
        ))}
      </div>
      {routes.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showAll ? 'Pokaż mniej' : `Pokaż wszystkie (${routes.length})`}
        </button>
      )}
    </div>
  );
};
