import { Receipt } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TollCostsInputProps {
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
}

export const TollCostsInput = ({ value, onChange, compact = false }: TollCostsInputProps) => {
  if (compact) {
    return (
      <div className="pt-3 border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <Receipt className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-foreground">Opłaty drogowe (zł)</span>
        </div>
        <div className="relative">
          <Input
            type="number"
            inputMode="decimal"
            style={{ fontSize: '16px' }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0"
            className="h-9 text-sm pr-10"
            step="1"
            min="0"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            zł
          </span>
        </div>
      </div>
    );
  }

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
            inputMode="decimal"
            style={{ fontSize: '16px' }}
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
