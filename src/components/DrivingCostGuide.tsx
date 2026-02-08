import { TrendingDown, Gauge, Route } from 'lucide-react';

export const DrivingCostGuide = () => {
  return (
    <section className="mt-8 bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Jak obliczyć koszt przejazdu samochodem?
      </h2>

      <div className="text-muted-foreground space-y-4 leading-relaxed text-sm">
        <p>
          Koszt przejazdu samochodem zależy przede wszystkim od trzech czynników:{' '}
          <strong className="text-foreground">dystansu</strong>,{' '}
          <strong className="text-foreground">spalania pojazdu</strong> oraz{' '}
          <strong className="text-foreground">aktualnej ceny paliwa</strong>.
          Wzór jest prosty: (dystans / 100) × spalanie × cena za litr. Na przykład trasa o długości
          300 km samochodem spalającym 7 L/100km przy cenie benzyny 5,89 zł/L to koszt ok.
          124 zł za samo paliwo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Route className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Dystans</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Najkrótsza trasa nie zawsze jest najtańsza. Drogi ekspresowe i autostrady
              pozwalają jechać oszczędniej przy stałej prędkości, ale mogą wiązać się
              z opłatami drogowymi.
            </p>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Spalanie</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Średnie spalanie zależy od typu pojazdu, stylu jazdy i prędkości.
              Jazda 90–110 km/h na autostradzie jest optymalnym kompromisem
              między czasem a zużyciem paliwa.
            </p>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Oszczędności</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              LPG kosztuje ok. 2,69 zł/L, ale spalanie jest wyższe o ~20%.
              Diesel jest droższy od Pb95, ale silniki wysokoprężne palą o ~5% mniej.
              Porównaj koszty w naszym kalkulatorze.
            </p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Opłaty drogowe w Polsce – co warto wiedzieć?
        </h3>
        <p>
          W Polsce płatne odcinki autostrad dotyczą głównie A1 (Gdańsk–Toruń), A2 (odcinki koncesyjne
          między Nowym Tomyślem a Strykowem) oraz A4 Katowice–Kraków (Stalexport). Pozostałe drogi
          ekspresowe (S-ki) i autostrady rządowe są bezpłatne dla samochodów osobowych.
          Przy planowaniu podróży za granicę pamiętaj o winietach – w Czechach i Austrii obowiązują
          e-winiety, które można kupić online.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Spalinowy czy elektryczny – co się bardziej opłaca?
        </h3>
        <p>
          Na krótkich trasach miejskich samochód elektryczny jest zdecydowanie tańszy w eksploatacji,
          szczególnie przy ładowaniu domowym (~0,65 zł/kWh). Na długich trasach autostradowych
          różnica się zmniejsza – ładowanie DC kosztuje średnio 2,09 zł/kWh, a zużycie energii
          na autostradzie rośnie do ok. 20 kWh/100km. Skorzystaj z naszego porównania „Spalinowy
          vs elektryczny", aby zobaczyć różnicę dla konkretnej trasy.
        </p>
      </div>
    </section>
  );
};
