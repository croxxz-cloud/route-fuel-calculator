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
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-background text-foreground border-2 border-border hover:border-primary/50 hover:shadow-sm'
        }`}
      >
        <Car className="w-5 h-5" />
        <span>Spalinowy</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('electric')}
        className={`relative flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
          value === 'electric'
            ? 'bg-success text-success-foreground shadow-lg'
            : 'bg-background text-foreground border-2 border-border hover:border-success/50 hover:shadow-sm'
        }`}
      >
        <Zap className="w-5 h-5" />
        <span>Elektryczny</span>
      </button>
    </div>
  );
};
