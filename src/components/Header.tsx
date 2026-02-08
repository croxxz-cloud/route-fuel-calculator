import { Fuel } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
            <Fuel className="w-5 h-5 text-primary" />
          </div>
          <span className="font-bold text-lg text-foreground hidden sm:block">
            Kalkulator Paliwa
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <a 
            href="#faq" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-secondary/50"
          >
            FAQ
          </a>
          <Link 
            to="/kontakt" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-secondary/50"
          >
            Kontakt
          </Link>
        </div>
      </nav>
    </header>
  );
};
