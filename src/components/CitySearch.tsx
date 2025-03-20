
import { useState, useEffect, useRef } from "react";
import { searchCities } from "@/lib/api";
import { Search, MapPin } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CitySearchProps {
  onCitySelect: (city: string) => void;
  className?: string;
}

export default function CitySearch({ onCitySelect, className }: CitySearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search cities when query changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const data = await searchCities(query);
        if (data && Array.isArray(data)) {
          setResults(data);
          setIsOpen(data.length > 0);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error("Error searching cities:", error);
        toast.error("Failed to search cities. Please try again.");
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query]);

  // Handle city selection
  const handleCitySelect = (cityName: string, countryCode: string) => {
    const cityWithCountry = `${cityName}, ${countryCode}`;
    setQuery(cityWithCountry);
    onCitySelect(cityWithCountry);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full px-4 py-3 pr-10 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? (
            <div className="w-5 h-5 rounded-full border-2 border-gray-300 border-t-primary animate-spin" />
          ) : (
            <Search size={20} />
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 overflow-hidden animate-slide-up">
          <ul className="py-1 max-h-60 overflow-auto subtle-scroll">
            {results.map((city, index) => (
              <li
                key={`${city.name}-${city.country}-${index}`}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150 flex items-center gap-2"
                onClick={() => handleCitySelect(city.name, city.country)}
              >
                <MapPin size={16} className="text-primary" />
                <span>
                  {city.name}, {city.country}
                  {city.admin1 && ` (${city.admin1})`}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
