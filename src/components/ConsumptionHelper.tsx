import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { HelpCircle } from 'lucide-react';

interface ConsumptionHelperProps {
  onSelect: (value: string) => void;
}

const carTypes = [
  { value: '5.5', label: 'Małe auto', description: '5-6 L/100km' },
  { value: '6.5', label: 'Kompakt', description: '6-7 L/100km' },
  { value: '7.5', label: 'Sedan / Hatchback', description: '7-8 L/100km' },
  { value: '9', label: 'SUV', description: '8-10 L/100km' },
  { value: '11', label: 'Duże SUV / Van', description: '10-12 L/100km' },
];

export const ConsumptionHelper = ({ onSelect }: ConsumptionHelperProps) => {
  return (
    <div className="mt-2">
      <Select onValueChange={onSelect}>
        <SelectTrigger className="w-full h-9 text-xs bg-background border border-border hover:border-primary/40 hover:bg-background transition-colors focus:ring-1 focus:ring-primary/30">
          <div className="flex items-center gap-2 text-muted-foreground">
            <HelpCircle className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Nie wiesz ile pali?</span>
          </div>
        </SelectTrigger>
        <SelectContent 
          className="bg-card border-border shadow-xl" 
          style={{ zIndex: 100 }}
          position="popper"
          sideOffset={4}
        >
          {carTypes.map((car) => (
            <SelectItem key={car.value} value={car.value} className="cursor-pointer hover:bg-secondary">
              <div className="flex flex-col py-0.5">
                <span className="font-medium text-foreground">{car.label}</span>
                <span className="text-xs text-muted-foreground">{car.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
