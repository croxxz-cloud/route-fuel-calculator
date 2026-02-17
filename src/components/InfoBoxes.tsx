import { Calculator, BarChart3, Fuel } from 'lucide-react';

export const InfoBoxes = () => {
  return (
    <div className="mt-10 space-y-4">
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

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Fuel className="w-4 h-4 text-primary" />
          Różnice między paliwami
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong>LPG:</strong> Cena litra o ponad połowę niższa niż benzyny, ale spalanie wyższe o ok. 20%</li>
          <li><strong>Diesel:</strong> Droższy od Pb95, ale silnik zużywa ok. 5% mniej paliwa</li>
          <li><strong>Pb98 vs Pb95:</strong> Wyższa cena, zbliżone spalanie — opłaca się głównie w silnikach wysokoprężnych</li>
        </ul>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-primary" />
          Co zobaczysz w wyniku?
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong>Koszt przejazdu</strong> — w złotówkach, z podziałem na paliwo i opłaty</li>
          <li><strong>Zużycie paliwa</strong> — ile litrów lub kWh potrzebujesz na trasę</li>
          <li><strong>Porównanie paliw</strong> — Pb95 vs Pb98 vs Diesel vs LPG na tej samej trasie</li>
          <li><strong>Spalinowy vs elektryczny</strong> — ile zaoszczędzisz na aucie elektrycznym</li>
        </ul>
      </div>
    </div>
  );
};
