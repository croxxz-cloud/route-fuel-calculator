import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';

const Terms = () => {
  return (
    <>
      <Helmet>
        <title>Regulamin | Kalkulator Paliwa</title>
        <meta name="description" content="Regulamin korzystania z serwisu Kalkulator Paliwa. Zasady użytkowania i odpowiedzialność." />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8 md:py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Powrót do kalkulatora
          </Link>

          <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Regulamin</h1>
                <p className="text-sm text-muted-foreground">Ostatnia aktualizacja: luty 2026</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-foreground space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-foreground">1. Postanowienia ogólne</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Niniejszy Regulamin określa zasady korzystania z serwisu internetowego Kalkulator Paliwa
                  (dalej: „Serwis"). Korzystanie z Serwisu jest bezpłatne i nie wymaga rejestracji.
                  Korzystając z Serwisu, użytkownik akceptuje postanowienia niniejszego Regulaminu.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">2. Zakres usług</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Serwis umożliwia szacunkowe obliczenie kosztów przejazdu samochodem na podstawie
                  wprowadzonych parametrów: trasy, spalania pojazdu oraz ceny paliwa. Serwis udostępnia
                  również informacje o popularnych trasach, opłatach drogowych oraz porównanie kosztów
                  różnych rodzajów paliw.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">3. Charakter informacyjny</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Wyniki obliczeń mają charakter wyłącznie szacunkowy i informacyjny. Rzeczywiste
                  koszty przejazdu mogą się różnić w zależności od wielu czynników, takich jak:
                  styl jazdy, warunki drogowe i pogodowe, obciążenie pojazdu, stan techniczny pojazdu,
                  aktualne ceny paliw na stacjach oraz zmiany w opłatach drogowych.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Właściciel Serwisu nie ponosi odpowiedzialności za decyzje podjęte na podstawie
                  wyników kalkulatora ani za ewentualne różnice między szacunkami a rzeczywistymi kosztami.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">4. Dane i źródła</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Ceny paliw prezentowane w Serwisie są średnimi cenami orientacyjnymi aktualizowanymi
                  okresowo na podstawie publicznie dostępnych źródeł. Trasy i dystanse wyznaczane są
                  z wykorzystaniem danych OpenStreetMap i usługi OpenRouteService. Opłaty drogowe
                  podawane są w przybliżeniu i mogą ulec zmianie.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">5. Prawa autorskie</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Treści zawarte w Serwisie, w tym teksty, grafiki i układ strony, stanowią własność
                  właściciela Serwisu i są chronione prawem autorskim. Kopiowanie, rozpowszechnianie
                  lub modyfikowanie treści Serwisu bez zgody właściciela jest zabronione.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">6. Dostępność serwisu</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Właściciel Serwisu dokłada starań, aby Serwis był dostępny nieprzerwanie, jednak
                  nie gwarantuje jego ciągłej dostępności. Serwis może być czasowo niedostępny
                  z powodu prac technicznych, aktualizacji lub awarii.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">7. Zmiany regulaminu</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Właściciel Serwisu zastrzega sobie prawo do wprowadzania zmian w Regulaminie.
                  Zmieniony Regulamin wchodzi w życie z chwilą opublikowania na tej stronie.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">8. Kontakt</h2>
                <p className="text-muted-foreground leading-relaxed">
                  W sprawach związanych z Serwisem prosimy o kontakt za pośrednictwem{' '}
                  <Link to="/kontakt" className="text-primary hover:underline">formularza kontaktowego</Link>.
                </p>
              </section>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Terms;
