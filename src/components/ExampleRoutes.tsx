import { useState } from 'react';
import { MapPin, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { routesData } from '@/data/routesData';

interface ExampleRoutesProps {
  onSelect: (from: string, to: string) => void;
}

export const ExampleRoutes = ({ onSelect }: ExampleRoutesProps) => {
  const [showAll, setShowAll] = useState(false);
  const visibleRoutes = showAll ? routesData : routesData.slice(0, 6);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Popularne trasy:
      </h3>
      <div className="space-y-2">
        {visibleRoutes.map((route) => (
          <div
            key={route.slug}
            className="flex items-center gap-2"
          >
            <button
              onClick={() => onSelect(route.from, route.to)}
              className="flex-1 flex items-center gap-3 p-3 bg-input hover:bg-secondary/80 border border-border hover:border-primary/30 rounded-xl transition-all group text-left"
            >
              <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm text-foreground truncate">{route.from}</span>
                <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="text-sm text-foreground truncate">{route.to}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{route.distance} km</span>
            </button>
            <Link
              to={`/trasa/${route.slug}`}
              className="p-3 bg-input hover:bg-primary/10 border border-border hover:border-primary/30 rounded-xl transition-all"
              title={`Szczegóły trasy ${route.from} - ${route.to}`}
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-primary" />
            </Link>
          </div>
        ))}
      </div>
      {routesData.length > 6 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          {showAll ? 'Pokaż mniej' : `Pokaż wszystkie (${routesData.length})`}
        </button>
      )}
    </div>
  );
};
