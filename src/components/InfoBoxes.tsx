import { Calculator } from 'lucide-react';

export const InfoBoxes = () => {
  return (
    <div className="mt-10">
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Jak liczymy?
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong>Dystans:</strong> Realna trasa drogowa na podstawie map</li>
          <li><strong>Koszt paliwa:</strong> (dystans / 100) × spalanie × cena za litr</li>
          <li><strong>Opłaty drogowe:</strong> Doliczane osobno do kosztu paliwa</li>
        </ul>
      </div>
    </div>
  );
};
