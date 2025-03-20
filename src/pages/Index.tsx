
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import CitySearch from "@/components/CitySearch";
import CurrentWeather from "@/components/CurrentWeather";
import Forecast from "@/components/Forecast";
import { groupForecastByDay } from "@/lib/utils";
import { 
  getCurrentWeather, 
  getCurrentWeatherByCoords, 
  getForecast, 
  getForecastByCoords,
  getAirPollution 
} from "@/lib/api";
import { MapPin } from "lucide-react";

const Index = () => {
  const [city, setCity] = useState<string>("London");
  const [coordinates, setCoordinates] = useState<{lat: number, lon: number} | null>(null);

  // Get user's location if allowed
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Default to London if geolocation is denied
          setCity("London");
        }
      );
    }
  }, []);

  // Current weather query
  const { 
    data: weatherData, 
    isLoading: isLoadingWeather,
    isError: isErrorWeather
  } = useQuery({
    queryKey: ['currentWeather', city, coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (coordinates) {
        return getCurrentWeatherByCoords(coordinates.lat, coordinates.lon);
      }
      return getCurrentWeather(city);
    },
    enabled: !!(city || coordinates)
  });

  // Weather forecast query
  const { 
    data: forecastData,
    isLoading: isLoadingForecast,
    isError: isErrorForecast
  } = useQuery({
    queryKey: ['forecast', city, coordinates?.lat, coordinates?.lon],
    queryFn: async () => {
      if (coordinates) {
        return getForecastByCoords(coordinates.lat, coordinates.lon);
      }
      return getForecast(city);
    },
    enabled: !!(city || coordinates)
  });
  
  // Air quality query
  const {
    data: airQualityData,
    isLoading: isLoadingAir
  } = useQuery({
    queryKey: ['airQuality', weatherData?.coord?.lat, weatherData?.coord?.lon],
    queryFn: () => getAirPollution(weatherData.coord.lat, weatherData.coord.lon),
    enabled: !!weatherData?.coord
  });

  // Process daily forecast data
  const dailyForecast = forecastData ? groupForecastByDay(forecastData.list) : [];

  // Handle city search selection
  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setCoordinates(null); // Clear coordinates to use city name instead
    toast.success(`Weather updated for ${selectedCity}`);
  };

  // Handle getting current location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setCity(""); // Clear city to use coordinates
          toast.success("Using your current location");
        },
        () => {
          toast.error("Unable to get your location. Please check your browser permissions.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // Loading state
  const isLoading = isLoadingWeather || isLoadingForecast;
  const isError = isErrorWeather || isErrorForecast;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-light text-gray-800 mb-2 tracking-wide">
            Weather <span className="font-medium">Dashboard</span>
          </h1>
          <p className="text-gray-500 mb-6">Check current conditions and forecast</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <CitySearch onCitySelect={handleCitySelect} />
            
            <button 
              onClick={handleGetLocation}
              className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl 
                        hover:bg-white transition-colors duration-200 shadow-sm"
            >
              <MapPin size={18} className="text-primary" />
              <span>Use My Location</span>
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse-slow">
              <div className="h-16 w-16 rounded-full border-4 border-gray-200 border-t-primary animate-spin"></div>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center p-8 glass-panel rounded-2xl">
            <h3 className="text-xl text-gray-700 mb-2">Unable to load weather data</h3>
            <p className="text-gray-500">
              Please check your connection or try another city.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <CurrentWeather data={weatherData} airQuality={airQualityData} />
            <Forecast dailyData={dailyForecast} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
