import { Calculator, Database } from 'lucide-react';

export const InfoBoxes = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 mt-10">
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
          <li>Źródło cen: e-petrol.pl</li>
        </ul>
      </div>
    </div>
  );
};
