import { TrendingDown, Gauge, Route } from 'lucide-react';

export const DrivingCostGuide = () => {
  return (
    <section className="mt-8 bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-foreground mb-4">
        Jak obliczyć koszt przejazdu samochodem?
      </h2>

      <div className="text-muted-foreground space-y-4 leading-relaxed text-sm">
        <p>
          Planowanie budżetu na podróż samochodem sprowadza się do trzech rzeczy:{' '}
          <strong className="text-foreground">ile kilometrów jedziesz</strong>,{' '}
          <strong className="text-foreground">ile pali Twój samochód</strong> i{' '}
          <strong className="text-foreground">ile kosztuje paliwo</strong>.
          Wzór jest prosty: dzielisz dystans przez 100, mnożysz przez spalanie i cenę litra.
          Przykładowo — 300 km autem palącym 7 litrów na setkę przy benzynie za 5,89 zł to mniej
          więcej 124 zł za samo paliwo.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Route className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Dystans i trasa</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Najkrótsza trasa nie zawsze jest najtańsza. Autostrady pozwalają jechać oszczędniej
              dzięki stałej prędkości, ale na niektórych odcinkach zapłacisz za przejazd.
              Warto sprawdzić oba warianty.
            </p>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Spalanie auta</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Ile Twój samochód faktycznie pali, zależy od prędkości, stylu jazdy i tego, ile wiezie.
              Na autostradzie przy 90–110 km/h spalanie jest najniższe. Powyżej 130 km/h rośnie
              zauważalnie.
            </p>
          </div>

          <div className="bg-secondary/40 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-foreground text-sm">Rodzaj paliwa</h3>
            </div>
            <p className="text-xs text-muted-foreground">
              LPG kosztuje o połowę mniej za litr niż benzyna, ale auto pali go o ok. 20% więcej.
              Diesel jest droższy od Pb95, ale silnik diesla zużywa ok. 5% mniej paliwa.
              Nasz kalkulator uwzględnia te różnice automatycznie.
            </p>
          </div>
        </div>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Które autostrady w Polsce są płatne?
        </h3>
        <p>
          W Polsce za przejazd samochodem osobowym zapłacisz na trzech odcinkach: A1 między Gdańskiem
          a Toruniem (AmberOne), A2 na odcinkach koncesyjnych między Nowym Tomyślem a Strykowem,
          oraz A4 między Katowicami a Krakowem (Stalexport). Pozostałe autostrady i wszystkie drogi
          ekspresowe (S-ki) są bezpłatne. Jeśli jedziesz za granicę — w Czechach i Austrii potrzebujesz
          e-winiety, którą kupisz online przed wjazdem na autostradę.
        </p>

        <h3 className="text-base font-semibold text-foreground mt-6">
          Czy warto tankować LPG na długą trasę?
        </h3>
        <p>
          Na trasach powyżej 200 km LPG wychodzi zdecydowanie taniej niż benzyna — mimo wyższego
          spalania o ok. 20%, cena litra jest o ponad połowę niższa. Na trasie Warszawa–Kraków (295 km)
          różnica może sięgać 40–50 zł. Jedyny minus to mniejsza sieć stacji LPG na autostradach,
          więc warto sprawdzić dostępność po drodze.
        </p>
      </div>
    </section>
  );
};
