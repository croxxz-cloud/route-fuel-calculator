import { Info, TrendingUp, Calendar } from 'lucide-react';
import { FuelPrices } from '@/hooks/useFuelPrices';

interface FuelPricesInfoProps {
  prices: FuelPrices;
}

export const FuelPricesInfo = ({ prices }: FuelPricesInfoProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Aktualne średnie ceny paliw w Polsce
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            <div className="bg-background/50 rounded-lg px-3 py-2 text-center">
              <span className="text-xs text-muted-foreground block">Pb95</span>
              <span className="text-sm font-bold text-green-600">{prices.pb95.toFixed(2)} zł</span>
            </div>
            <div className="bg-background/50 rounded-lg px-3 py-2 text-center">
              <span className="text-xs text-muted-foreground block">Pb98</span>
              <span className="text-sm font-bold text-blue-600">{prices.pb98.toFixed(2)} zł</span>
            </div>
            <div className="bg-background/50 rounded-lg px-3 py-2 text-center">
              <span className="text-xs text-muted-foreground block">Diesel</span>
              <span className="text-sm font-bold text-yellow-600">{prices.diesel.toFixed(2)} zł</span>
            </div>
            <div className="bg-background/50 rounded-lg px-3 py-2 text-center">
              <span className="text-xs text-muted-foreground block">LPG</span>
              <span className="text-sm font-bold text-purple-600">{prices.lpg.toFixed(2)} zł</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Aktualizacja: {formatDate(prices.lastUpdated)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Info className="w-3 h-3" />
              <span>Źródło: {prices.source}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
