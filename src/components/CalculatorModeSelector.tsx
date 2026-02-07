import { Route, Edit3 } from 'lucide-react';

export type CalculatorMode = 'route' | 'manual';

interface CalculatorModeSelectorProps {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export const CalculatorModeSelector = ({ mode, onChange }: CalculatorModeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1.5 bg-secondary/50 rounded-xl mb-6 border border-border">
      <button
        onClick={() => onChange('route')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
          mode === 'route'
            ? 'bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-background'
        }`}
      >
        <Route className="w-4 h-4" />
        <span>Trasa A → B</span>
      </button>
      <button
        onClick={() => onChange('manual')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
          mode === 'manual'
            ? 'bg-primary text-primary-foreground shadow-lg ring-1 ring-primary/50'
            : 'text-muted-foreground hover:text-foreground hover:bg-background'
        }`}
      >
        <Edit3 className="w-4 h-4" />
        <span>Własny dystans</span>
      </button>
    </div>
  );
};
