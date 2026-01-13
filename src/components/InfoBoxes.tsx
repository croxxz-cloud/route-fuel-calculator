import { TrendingUp, Calculator, Database } from 'lucide-react';
import { FuelPrices } from '@/hooks/useFuelPrices';

interface InfoBoxesProps {
  prices: FuelPrices;
}

export const InfoBoxes = ({ prices }: InfoBoxesProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 mt-10">
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-primary" />
          Ceny paliw – {formatDate(prices.lastUpdated)}
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-success">Pb95:</strong> {prices.pb95.toFixed(2)} zł/L</li>
          <li><strong className="text-success">Pb98:</strong> {prices.pb98.toFixed(2)} zł/L</li>
          <li><strong className="text-success">Diesel:</strong> {prices.diesel.toFixed(2)} zł/L</li>
          <li><strong className="text-success">LPG:</strong> {prices.lpg.toFixed(2)} zł/L</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Metodologia
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong>Dystans:</strong> Realna trasa drogowa (OSRM)</li>
          <li><strong>Koszt:</strong> (dystans / 100) × spalanie × cena</li>
          <li><strong>Spalanie:</strong> Możesz wpisać własne lub wybrać średnią</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          Źródła danych
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="https://www.openstreetmap.org" target="_blank" rel="noopener" className="hover:text-primary transition-colors">OpenStreetMap</a> – mapy i geolokalizacja</li>
          <li><a href="https://project-osrm.org" target="_blank" rel="noopener" className="hover:text-primary transition-colors">OSRM</a> – routing tras</li>
          <li>Średnie ceny rynkowe – orientacyjne</li>
        </ul>
      </div>
    </div>
  );
};
