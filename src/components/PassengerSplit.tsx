import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Users } from 'lucide-react';

interface PassengerSplitProps {
  totalCost: number;
}

export const PassengerSplit = ({ totalCost }: PassengerSplitProps) => {
  const [enabled, setEnabled] = useState(false);
  const [passengers, setPassengers] = useState('2');

  const passengerCount = parseInt(passengers) || 1;
  const costPerPerson = totalCost / passengerCount;

  return (
    <div className="bg-secondary/30 rounded-xl p-4 mt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">Podziel koszt na pasażerów</span>
        </div>
        <Switch checked={enabled} onCheckedChange={setEnabled} />
      </div>
      
      {enabled && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Liczba osób:</label>
            <Input
              type="number"
              value={passengers}
              onChange={(e) => setPassengers(e.target.value)}
              min="1"
              max="20"
              className="w-20 h-9"
            />
          </div>
          <div className="bg-primary/10 rounded-lg p-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">Koszt na osobę</p>
            <p className="text-2xl font-bold text-primary">{costPerPerson.toFixed(2)} zł</p>
          </div>
        </div>
      )}
    </div>
  );
};
