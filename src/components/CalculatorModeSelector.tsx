import { Route, Edit3 } from 'lucide-react';

export type CalculatorMode = 'route' | 'manual';

interface CalculatorModeSelectorProps {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export const CalculatorModeSelector = ({ mode, onChange }: CalculatorModeSelectorProps) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onChange('route')}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
          mode === 'route'
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-background text-foreground border-2 border-border hover:border-primary/50 hover:shadow-sm'
        }`}
      >
        <Route className="w-4 h-4" />
        <span>Trasa A → B</span>
      </button>
      <button
        onClick={() => onChange('manual')}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
          mode === 'manual'
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'bg-background text-foreground border-2 border-border hover:border-primary/50 hover:shadow-sm'
        }`}
      >
        <Edit3 className="w-4 h-4" />
        <span>Własny dystans</span>
      </button>
    </div>
  );
};
