import { Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TollCostsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const TollCostsInput = ({ value, onChange }: TollCostsInputProps) => {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-3">
        <Receipt className="w-5 h-5 text-primary" />
        <div>
          <span className="text-sm font-medium text-foreground block">Opłaty drogowe</span>
          <p className="text-xs text-muted-foreground">Autostrady, winiety, tunele itp.</p>
        </div>
      </div>
      <div className="relative">
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0"
          className="h-12 text-lg pr-12"
          min="0"
          step="1"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
          zł
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-2">
        Wpisz sumę opłat za przejazd (np. A2 Konin-Stryków: 12 zł)
      </p>
    </div>
  );
};
