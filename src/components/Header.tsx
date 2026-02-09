import { Link } from 'react-router-dom';
import logo from '@/assets/trasomat-logo.webp';

export const Header = () => {
  return (
    <header className="z-50 bg-background border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src={logo} alt="Trasomat.pl" className="h-14 w-auto" />
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
