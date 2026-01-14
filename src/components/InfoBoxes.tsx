import { TrendingUp, Calculator, Database, Zap } from 'lucide-react';
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-10">
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
          <Zap className="w-4 h-4 text-success" />
          Auta elektryczne
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong className="text-success">Stacje DC:</strong> ~1.00-2.00 zł/kWh</li>
          <li><strong className="text-success">Ładowanie w domu:</strong> ~0.65 zł/kWh</li>
          <li><strong className="text-success">Średnie zużycie:</strong> 15-25 kWh/100km</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Metodologia
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong>Dystans:</strong> Realna trasa drogowa (OSRM)</li>
          <li><strong>Koszt:</strong> (dystans / 100) × zużycie × cena</li>
          <li><strong>Opłaty:</strong> Dodawane do kosztu energii</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Database className="w-4 h-4 text-primary" />
          Źródła danych
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><a href="https://www.openstreetmap.org" target="_blank" rel="noopener" className="hover:text-primary transition-colors">OpenStreetMap</a> – mapy</li>
          <li><a href="https://project-osrm.org" target="_blank" rel="noopener" className="hover:text-primary transition-colors">OSRM</a> – routing</li>
          <li>Ceny orientacyjne</li>
        </ul>
      </div>
    </div>
  );
};
