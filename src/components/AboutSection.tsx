import { ShieldCheck, Database, MapPin, RefreshCw } from 'lucide-react';

export const AboutSection = () => {
  return (
    <section className="mt-12 bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-bold text-foreground mb-4">O Serwisie</h2>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Kalkulator Paliwa to niezależne narzędzie stworzone z myślą o kierowcach planujących podróże
        po Polsce i Europie. Naszym celem jest dostarczanie rzetelnych, aktualnych i przejrzystych
        szacunków kosztów przejazdu – bez reklam i ukrytych opłat.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Database className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Wiarygodne dane</h3>
            <p className="text-xs text-muted-foreground">
              Ceny paliw opieramy na danych e-petrol.pl i aktualizujemy co tydzień.
              Opłaty drogowe weryfikujemy z oficjalnymi cennikami operatorów.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Realne trasy</h3>
            <p className="text-xs text-muted-foreground">
              Dystanse i czasy przejazdu bazują na OpenStreetMap i OpenRouteService –
              tych samych danych, z których korzystają nawigacje.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Prywatność</h3>
            <p className="text-xs text-muted-foreground">
              Nie zbieramy danych osobowych. Obliczenia wykonywane są bezpośrednio
              w Twojej przeglądarce – nic nie trafia na nasze serwery.
            </p>
          </div>
        </div>

        <div className="flex gap-3 items-start">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <RefreshCw className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">Regularnie aktualizowane</h3>
            <p className="text-xs text-muted-foreground">
              Ceny paliw, opłaty drogowe i winiety aktualizujemy regularnie,
              aby szacunki były jak najbardziej zbliżone do rzeczywistości.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
