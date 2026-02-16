import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getRouteBySlug, routesData } from '@/data/routesData';
import { RouteVariantsTable } from '@/components/RouteVariantsTable';
import { MapPin, ArrowRight, Clock, Fuel, AlertTriangle, Settings, Route, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const RoutePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const route = getRouteBySlug(slug || '');

  if (!route) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Trasa nie znaleziona</h1>
            <Link to="/" className="text-primary hover:underline">Wróć do kalkulatora</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const estimatedCost = ((route.distance / 100) * route.defaultConsumption * route.defaultFuelPrice).toFixed(0);
  const totalTollCost = route.tollSections.reduce((sum, toll) => sum + toll.cost, 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Koszt przejazdu {route.from} - {route.to} | Kalkulator Paliwa</title>
        <meta 
          name="description" 
          content={`Oblicz koszt przejazdu na trasie ${route.from} - ${route.to}. Dystans ${route.distance} km. Szacunkowy koszt: ${estimatedCost} zł.`} 
        />
      </Helmet>

      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Powrót do kalkulatora
        </Link>

        {/* Hero Section */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 md:p-8 mb-6 overflow-hidden">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <Route className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground break-words">
                Koszt przejazdu {route.from} – {route.to}
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">Ile kosztuje przejazd samochodem?</p>
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-5 mb-6 overflow-hidden">
            <p className="text-sm sm:text-base md:text-lg text-foreground leading-relaxed break-words">
              Szacunkowy koszt przejazdu na trasie <strong className="whitespace-nowrap">{route.from} – {route.to}</strong> to{' '}
              <span className="text-primary font-bold text-lg sm:text-xl md:text-2xl whitespace-nowrap">{estimatedCost} zł</span>{' '}
              (przy cenie paliwa {route.defaultFuelPrice.toFixed(2)} zł/l). 
              Dystans: <strong>{route.distance} km</strong>, spalanie: <strong>{route.defaultConsumption} L/100km</strong>.
            </p>
          </div>

          <Link to={`/?from=${encodeURIComponent(route.from)}&to=${encodeURIComponent(route.to)}`}>
            <Button className="w-full md:w-auto gap-2">
              <Settings className="w-4 h-4" />
              Dostosuj parametry i przelicz
            </Button>
          </Link>
        </div>

        {/* Route Variants */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Do przejazdu możesz wybrać {route.variants.length} {route.variants.length === 1 ? 'trasę' : 'trasy'}:
          </h2>

          <div className="space-y-4">
            {route.variants.map((variant, index) => (
              <div 
                key={index}
                className="bg-muted/50 border border-border rounded-xl p-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-foreground">{variant.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Przez: {variant.via.join(' → ')}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">{variant.distance} km</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">
                        {variant.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Fuel className="w-4 h-4 text-primary" />
                      <span className="text-foreground font-medium">~{variant.avgCost} zł</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Variants Comparison Table */}
        {route.variants.length > 1 && (
          <RouteVariantsTable
            variants={route.variants}
            hasTolls={route.hasTolls}
            tollSections={route.tollSections}
            defaultConsumption={route.defaultConsumption}
            defaultFuelPrice={route.defaultFuelPrice}
          />
        )}

        {/* Toll Information */}
        <div className="bg-card border border-border rounded-2xl p-4 sm:p-6 mb-6 overflow-hidden">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-primary" />
            Opłaty drogowe
          </h2>

          {route.hasTolls ? (
            <>
              <p className="text-muted-foreground mb-4">
                Na trasie {route.from} – {route.to} mogą występować płatne odcinki (w zależności od wybranego wariantu):
              </p>
              {route.description && (
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4">
                  💡 {route.description}
                </p>
              )}
              <div className="space-y-2">
                {route.tollSections.map((toll, index) => (
                   <div 
                    key={index}
                    className="flex items-center justify-between gap-2 bg-muted/50 border border-border rounded-lg p-3"
                  >
                    <span className="text-foreground text-sm sm:text-base break-words min-w-0">{toll.name}</span>
                    <span className="font-semibold text-primary">{toll.cost} zł</span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-primary/10 border border-primary/30 rounded-lg p-3 mt-3">
                  <span className="font-medium text-foreground">Suma opłat drogowych (max)</span>
                  <span className="font-bold text-primary text-lg">{totalTollCost} zł</span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-success/10 border border-success/30 rounded-lg p-4">
              <p className="text-foreground">
                ✓ Na trasie {route.from} – {route.to} <strong>nie ma płatnych odcinków</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Other Popular Routes */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Inne popularne trasy
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {routesData
              .filter(r => r.slug !== slug)
              .slice(0, 6)
              .map((r) => (
                <Link
                  key={r.slug}
                  to={`/trasa/${r.slug}`}
                  className="flex items-center gap-3 p-3 bg-muted/50 hover:bg-secondary/80 border border-border hover:border-primary/30 rounded-xl transition-all group"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-foreground truncate">{r.from}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground truncate">{r.to}</span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{r.distance} km</span>
                </Link>
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RoutePage;
