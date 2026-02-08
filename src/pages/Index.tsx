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
        <link rel="canonical" href="/" />
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
