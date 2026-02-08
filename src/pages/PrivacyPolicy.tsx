import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <>
      <Helmet>
        <title>Polityka Prywatności | Kalkulator Paliwa</title>
        <meta name="description" content="Polityka prywatności serwisu Kalkulator Paliwa. Dowiedz się jak przetwarzamy Twoje dane." />
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
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Polityka Prywatności</h1>
                <p className="text-sm text-muted-foreground">Ostatnia aktualizacja: luty 2026</p>
              </div>
            </div>

            <div className="prose prose-sm max-w-none text-foreground space-y-6">
              <section>
                <h2 className="text-lg font-semibold text-foreground">1. Informacje ogólne</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Niniejsza Polityka Prywatności określa zasady przetwarzania i ochrony danych osobowych
                  użytkowników serwisu Kalkulator Paliwa (dalej: „Serwis"). Serwis nie wymaga rejestracji
                  ani logowania. Szanujemy prywatność naszych użytkowników i dokładamy wszelkich starań,
                  aby ją chronić.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">2. Administrator danych</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Administratorem danych osobowych jest właściciel serwisu Kalkulator Paliwa.
                  Kontakt z administratorem jest możliwy za pośrednictwem formularza na stronie{' '}
                  <Link to="/kontakt" className="text-primary hover:underline">Kontakt</Link>.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">3. Zakres zbieranych danych</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Serwis nie zbiera danych osobowych w sposób automatyczny. Kalkulator działa
                  w całości po stronie przeglądarki użytkownika. Dane wprowadzane do kalkulatora
                  (trasa, spalanie, cena paliwa) nie są przesyłane na nasze serwery ani zapisywane.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  W przypadku kontaktu za pomocą formularza kontaktowego, przetwarzamy: imię i nazwisko,
                  adres e-mail oraz treść wiadomości – wyłącznie w celu udzielenia odpowiedzi.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">4. Pliki cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Serwis może wykorzystywać pliki cookies w celach statystycznych i analitycznych.
                  Pliki cookies nie zawierają danych osobowych. Użytkownik może w każdej chwili
                  zmienić ustawienia dotyczące cookies w swojej przeglądarce internetowej.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">5. Usługi zewnętrzne</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Serwis korzysta z usługi OpenRouteService do wyznaczania tras oraz Nominatim
                  (OpenStreetMap) do wyszukiwania adresów. Zapytania do tych usług zawierają
                  wyłącznie dane o lokalizacji (nazwy miejscowości, współrzędne), a nie dane osobowe
                  użytkowników.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">6. Prawa użytkownika</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Użytkownik ma prawo do: dostępu do swoich danych, ich sprostowania, usunięcia,
                  ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec
                  przetwarzania. W celu realizacji tych praw prosimy o kontakt za pośrednictwem
                  formularza kontaktowego.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-foreground">7. Zmiany polityki prywatności</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Administrator zastrzega sobie prawo do wprowadzania zmian w Polityce Prywatności.
                  O wszelkich zmianach użytkownicy zostaną poinformowani poprzez zamieszczenie
                  nowej wersji Polityki Prywatności na tej stronie.
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

export default PrivacyPolicy;
