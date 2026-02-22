import { Calculator, BarChart3, Fuel } from 'lucide-react';

export const InfoBoxes = () => {
  return (
    <div className="mt-10 space-y-4">
      <div className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Trasomat w pigułce, czyli jak liczymy koszty przejazdu?
        </h3>
        <p className="text-sm text-muted-foreground mb-3">
          Mechanizm działania naszego narzędzia opiera się na kilku założeniach. Konkretnie, są to dane obejmujące:
        </p>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li><strong>Dystans:</strong> Przeliczymy dla Ciebie odległość trasy na podstawie map, jeżeli dobrze znasz dystans, możesz też wpisać własną odległość</li>
          <li><strong>Stosowany wzór na koszt paliwa:</strong> (dystans / 100) × spalanie × cena za litr</li>
          <li><strong>Opłaty drogowe:</strong> Doliczane są osobno do kosztu paliwa</li>
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
          <li><strong>Koszt przejazdu:</strong> przedstawiony w złotówkach, z podziałem na paliwo i opłaty</li>
          <li><strong>Zużycie paliwa:</strong> dowiesz się, ile litrów lub kWh potrzebujesz na trasę</li>
          <li><strong>Porównanie kosztu paliw:</strong> odpowie na pytanie: co właściwie wyjdzie najtaniej? Czyli zestawienie dla Pb95, Pb98, Diesel i LPG na tej samej trasie</li>
          <li><strong>Szacunkowy koszt podróży:</strong> po to, aby wiedzieć jak długa trasa Cię czeka i ile postojów zaplanować (w praktyce na trasie warto zrobić krótką przerwę mniej więcej co 2 godziny jazdy)</li>
        </ul>
      </div>
    </div>
  );
};
