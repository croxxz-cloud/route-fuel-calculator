import { RouteVariant, TollSection } from '@/data/routesData';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RouteVariantsTableProps {
  variants: RouteVariant[];
  hasTolls: boolean;
  tollSections: TollSection[];
  defaultConsumption: number;
  defaultFuelPrice: number;
}

export const RouteVariantsTable = ({
  variants,
  hasTolls,
  tollSections,
  defaultConsumption,
  defaultFuelPrice,
}: RouteVariantsTableProps) => {
  const totalTollCost = tollSections.reduce((sum, t) => sum + t.cost, 0);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-semibold text-foreground mb-4">
        Porównanie wariantów
      </h2>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trasa</TableHead>
              <TableHead className="text-right">Km</TableHead>
              <TableHead className="text-right">Czas</TableHead>
              <TableHead className="text-right">Paliwo</TableHead>
              <TableHead className="text-right">Opłaty</TableHead>
              <TableHead className="text-right font-bold">Łącznie</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variants.map((variant, i) => {
              const fuelCost = (variant.distance / 100) * defaultConsumption * defaultFuelPrice;
              // Assign tolls only if variant name suggests it's on a toll route
              const tollCost = hasTolls ? totalTollCost : 0;
              const total = fuelCost + tollCost;

              return (
                <TableRow key={i}>
                  <TableCell className="font-medium max-w-[180px]">
                    <div className="truncate">{variant.name}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {variant.via.join(' → ')}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{variant.distance}</TableCell>
                  <TableCell className="text-right whitespace-nowrap">{variant.time}</TableCell>
                  <TableCell className="text-right">{fuelCost.toFixed(0)} zł</TableCell>
                  <TableCell className="text-right">
                    {tollCost > 0 ? `${tollCost} zł` : '—'}
                  </TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {total.toFixed(0)} zł
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <p className="text-[10px] text-muted-foreground mt-3">
        Ceny orientacyjne przy spalaniu {defaultConsumption} L/100km i cenie {defaultFuelPrice.toFixed(2)} zł/L.
      </p>
    </div>
  );
};
