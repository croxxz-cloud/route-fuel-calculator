import { FuelCalculator } from '@/components/FuelCalculator';
import { FAQ } from '@/components/FAQ';
import { Helmet } from 'react-helmet-async';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Kalkulator Kosztów Przejazdu - Oblicz koszt paliwa na trasie</title>
        <meta 
          name="description" 
          content="Darmowy kalkulator kosztów przejazdu. Oblicz ile zapłacisz za paliwo na trasie samochodem. Pb95, Diesel, LPG. Realne trasy z OpenStreetMap." 
        />
        <meta name="keywords" content="kalkulator paliwa, koszt przejazdu, kalkulator trasy, spalanie, diesel, lpg, pb95" />
        <link rel="canonical" href="/" />
      </Helmet>
      
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <main className="relative z-10 container mx-auto px-4 py-12 md:py-20">
          <FuelCalculator />
          <FAQ />
        </main>
      </div>
    </>
  );
};

export default Index;
