import { MapPin, ArrowRight } from 'lucide-react';

interface ExampleRoutesProps {
  onSelect: (from: string, to: string) => void;
}

const routes = [
  { from: 'Warszawa', to: 'Kraków', distance: 294 },
  { from: 'Wrocław', to: 'Poznań', distance: 166 },
  { from: 'Gdańsk', to: 'Warszawa', distance: 340 },
  { from: 'Katowice', to: 'Łódź', distance: 194 },
  { from: 'Szczecin', to: 'Berlin', distance: 145 },
  { from: 'Kraków', to: 'Wiedeń', distance: 410 },
];

export const ExampleRoutes = ({ onSelect }: ExampleRoutesProps) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
        Popularne trasy
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {routes.map((route) => (
          <button
            key={`${route.from}-${route.to}`}
            onClick={() => onSelect(route.from, route.to)}
            className="flex items-center gap-3 p-3 bg-secondary/30 hover:bg-secondary/50 rounded-xl transition-all group text-left"
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
    </div>
  );
};
