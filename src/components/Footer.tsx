import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-border mt-16 py-8 bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-4">
          <span>© 2026 Kalkulator Paliwa</span>
          <span className="text-border">|</span>
          <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          <span className="text-border">|</span>
          <Link to="/kontakt" className="hover:text-foreground transition-colors">Kontakt</Link>
          <span className="text-border">|</span>
          <Link to="/polityka-prywatnosci" className="hover:text-foreground transition-colors">Polityka prywatności</Link>
          <span className="text-border">|</span>
          <Link to="/regulamin" className="hover:text-foreground transition-colors">Regulamin</Link>
          <span className="text-border">|</span>
          <span>Dane tras: © OpenStreetMap contributors</span>
        </div>
        <p className="text-xs text-muted-foreground/70">
          Wyniki są szacunkowe. Rzeczywiste koszty mogą się różnić w zależności od stylu jazdy i warunków drogowych.
        </p>
      </div>
    </footer>
  );
};
