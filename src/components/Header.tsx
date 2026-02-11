import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, MapPin } from 'lucide-react';
import logo from '@/assets/trasomat-logo.webp';
import { routesData } from '@/data/routesData';

export const Header = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="z-50 bg-background border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Trasomat.pl" className="h-14 w-auto" />
        </Link>

        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
          >
            <MapPin className="w-4 h-4" />
            Popularne trasy
            <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 py-2 animate-fade-in max-h-[70vh] overflow-y-auto">
                {routesData.map((route) => (
                  <Link
                    key={route.slug}
                    to={`/trasa/${route.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-sm text-foreground">{route.from} → {route.to}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{route.distance} km</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Static SEO nav - visible in prerendered HTML, hidden visually */}
      <nav aria-label="Popularne trasy" className="sr-only">
        <ul>
          {routesData.map((route) => (
            <li key={route.slug}>
              <Link to={`/trasa/${route.slug}`}>
                {route.from} – {route.to} ({route.distance} km)
              </Link>
            </li>
          ))}
          <li><Link to="/kontakt">Kontakt</Link></li>
          <li><Link to="/polityka-prywatnosci">Polityka prywatności</Link></li>
          <li><Link to="/regulamin">Regulamin</Link></li>
        </ul>
      </nav>
    </header>
  );
};
