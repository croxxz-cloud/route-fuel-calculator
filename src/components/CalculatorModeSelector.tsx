import { Route, Edit3 } from 'lucide-react';

export type CalculatorMode = 'route' | 'manual';

interface CalculatorModeSelectorProps {
  mode: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}

export const CalculatorModeSelector = ({ mode, onChange }: CalculatorModeSelectorProps) => {
  return (
    <div className="flex gap-2 p-1 bg-secondary/50 rounded-xl mb-6">
      <button
        onClick={() => onChange('route')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
          mode === 'route'
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        }`}
      >
        <Route className="w-4 h-4" />
        <span>Trasa A → B</span>
      </button>
      <button
        onClick={() => onChange('manual')}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
          mode === 'manual'
            ? 'bg-primary text-primary-foreground shadow-lg'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
        }`}
      >
        <Edit3 className="w-4 h-4" />
        <span>Własny dystans</span>
      </button>
    </div>
  );
};
