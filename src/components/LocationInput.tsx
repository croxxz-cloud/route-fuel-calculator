import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onLocationSelect: (lat: number, lon: number) => void;
  placeholder: string;
}

interface Suggestion {
  display_name: string;
  lat: string;
  lon: string;
}

export const LocationInput = ({
  label,
  value,
  onChange,
  onLocationSelect,
  placeholder,
}: LocationInputProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            'Accept-Language': 'pl,en',
          },
        }
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      searchLocations(newValue);
    }, 300);
  };

  // Auto-geocode on blur if user typed but didn't select a suggestion
  const handleBlur = () => {
    // Small delay to allow suggestion click to fire first
    setTimeout(() => {
      if (value.length >= 3 && suggestions.length > 0 && showSuggestions) {
        // Auto-select the first suggestion
        handleSuggestionClick(suggestions[0]);
      } else if (value.length >= 3 && suggestions.length === 0) {
        // No suggestions loaded yet — trigger a search and auto-select
        (async () => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&limit=1`,
              { headers: { 'Accept-Language': 'pl,en' } }
            );
            const data = await response.json();
            if (data.length > 0) {
              onLocationSelect(parseFloat(data[0].lat), parseFloat(data[0].lon));
            }
          } catch (error) {
            console.error('Auto-geocode failed:', error);
          }
        })();
      }
      setShowSuggestions(false);
    }, 250);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.display_name);
    onLocationSelect(parseFloat(suggestion.lat), parseFloat(suggestion.lon));
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-medium text-muted-foreground mb-2">
        {label}
      </label>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
        <Input
          value={value}
          onChange={handleInputChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="pl-12 pr-10 h-11 border-foreground/30 bg-background text-foreground"
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground animate-spin" />
        )}
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-card border border-border rounded-lg shadow-xl overflow-hidden animate-fade-in">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full px-4 py-3 text-left text-sm hover:bg-secondary/50 transition-colors flex items-start gap-3"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span className="text-foreground line-clamp-2">
                {suggestion.display_name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
