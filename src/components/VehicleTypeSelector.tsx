import { Car, Zap } from 'lucide-react';
import { VehicleType } from '@/hooks/useFuelPrices';

interface VehicleTypeSelectorProps {
  value: VehicleType;
  onChange: (value: VehicleType) => void;
}

export const VehicleTypeSelector = ({ value, onChange }: VehicleTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => onChange('fuel')}
        className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          value === 'fuel'
            ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background'
            : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
        }`}
      >
        <Car className="w-5 h-5" />
        <span>Spalinowy</span>
        {value === 'fuel' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
        )}
      </button>
      <button
        type="button"
        onClick={() => onChange('electric')}
        className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          value === 'electric'
            ? 'bg-success text-success-foreground shadow-lg ring-2 ring-success ring-offset-2 ring-offset-background'
            : 'bg-secondary text-muted-foreground hover:bg-secondary/80 hover:text-foreground'
        }`}
      >
        <Zap className="w-5 h-5" />
        <span>Elektryczny</span>
        {value === 'electric' && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-background" />
        )}
      </button>
    </div>
  );
};
