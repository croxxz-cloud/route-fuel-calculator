import { Fuel } from 'lucide-react';

interface FuelComparisonProps {
  distance: number;
  consumption: number;
}

const fuelPrices = [
  { type: 'Pb95', price: 6.50, color: 'bg-green-500' },
  { type: 'Pb98', price: 7.20, color: 'bg-blue-500' },
  { type: 'Diesel', price: 6.40, color: 'bg-yellow-500' },
  { type: 'LPG', price: 3.00, color: 'bg-purple-500' },
];

export const FuelComparison = ({ distance, consumption }: FuelComparisonProps) => {
  const calculateCost = (price: number) => {
    return (distance / 100) * consumption * price;
  };

  const maxCost = Math.max(...fuelPrices.map(f => calculateCost(f.price)));

  return (
    <div className="bg-secondary/30 rounded-xl p-5 mt-6">
      <div className="flex items-center gap-2 mb-4">
        <Fuel className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Porównanie paliw</h3>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Koszt tej trasy z różnymi paliwami (przy takim samym spalaniu):
      </p>
      <div className="space-y-3">
        {fuelPrices.map((fuel) => {
          const cost = calculateCost(fuel.price);
          const percentage = (cost / maxCost) * 100;
          
          return (
            <div key={fuel.type} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{fuel.type}</span>
                <span className="font-semibold text-foreground">{cost.toFixed(2)} zł</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={`h-full ${fuel.color} rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
