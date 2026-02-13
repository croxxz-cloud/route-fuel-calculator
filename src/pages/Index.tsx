import { FuelCalculator } from '@/components/FuelCalculator';
import { FAQ } from '@/components/FAQ';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AboutSection } from '@/components/AboutSection';
import { DrivingCostGuide } from '@/components/DrivingCostGuide';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Kalkulator Kosztów Przejazdu 2026: Oblicz Koszt Paliwa na Trasie</title>
        <meta 
          name="description" 
          content="Darmowy kalkulator kosztów przejazdu. Oblicz ile zapłacisz za paliwo na trasie samochodem. Pb95, Pb98, Diesel, LPG. Aktualne ceny i realne trasy." 
        />
        <meta name="keywords" content="kalkulator paliwa, koszt przejazdu, kalkulator trasy, spalanie, diesel, lpg, pb95, kalkulator benzyny" />
        <link rel="canonical" href="https://trasomat.pl/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Kalkulator Kosztów Przejazdu – Trasomat",
          "url": "https://trasomat.pl/",
          "applicationCategory": "TravelApplication",
          "applicationSubCategory": "Route Planning & Fuel/Energy Cost Calculator",
          "operatingSystem": "Web",
          "description": "Internetowy kalkulator kosztów przejazdu samochodem spalinowym i elektrycznym. Oblicza koszt paliwa lub energii na trasie A–B albo dla podanego dystansu, uwzględnia spalanie (l/100 km) lub zużycie energii (kWh/100 km), ceny paliw (Pb95, Pb98, ON, LPG) lub energii elektrycznej, przejazd w obie strony oraz opłaty drogowe.",
          "inLanguage": "pl-PL",
          "browserRequirements": "Wymaga przeglądarki internetowej z włączoną obsługą JavaScript",
          "featureList": [
            "Obliczanie kosztu przejazdu między miastami (Trasa A–B)",
            "Kalkulacja dla własnego dystansu (km)",
            "Obsługa pojazdów spalinowych i elektrycznych",
            "Obsługa paliw: Pb95, Pb98, ON, LPG",
            "Kalkulacja kosztu energii elektrycznej (kWh/100 km)",
            "Możliwość podania własnej ceny paliwa lub energii",
            "Opcja przejazdu w obie strony",
            "Uwzględnianie opłat drogowych"
          ],
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "PLN"
          },
          "provider": {
            "@type": "Organization",
            "name": "Trasomat",
            "url": "https://trasomat.pl/"
          }
        })}</script>
      </Helmet>
      
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8 md:py-12">
          <FuelCalculator />

          <DrivingCostGuide />

          <AboutSection />

          <div id="faq">
            <FAQ />
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Index;
