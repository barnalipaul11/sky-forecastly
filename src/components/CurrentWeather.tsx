
import { formatTemp, formatWeatherDescription, getWeatherIcon } from "@/lib/utils";
import { Wind, Droplets, ThermometerSun } from "lucide-react";

interface CurrentWeatherProps {
  data: any;
  airQuality?: any;
}

export default function CurrentWeather({ data, airQuality }: CurrentWeatherProps) {
  if (!data) return null;

  const {
    name,
    main,
    weather,
    wind,
    sys,
  } = data;

  const aqi = airQuality?.list?.[0]?.main?.aqi;
  
  function getAqiLabel(aqi: number) {
    const labels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];
    return labels[aqi - 1] || "Unknown";
  }
  
  function getAqiColor(aqi: number) {
    const colors = [
      "bg-green-500", // Good
      "bg-green-300", // Fair
      "bg-yellow-400", // Moderate
      "bg-orange-500", // Poor
      "bg-red-500", // Very Poor
    ];
    return colors[aqi - 1] || "bg-gray-400";
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Location and Temperature */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-medium text-gray-700">
            {name}, {sys.country}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
            <div className="text-6xl font-light">{formatTemp(main.temp)}</div>
            <div>
              <div className="text-sm text-gray-500">Feels like</div>
              <div className="text-xl">{formatTemp(main.feels_like)}</div>
            </div>
          </div>
          <div className="mt-1 text-lg text-gray-600 capitalize">
            {formatWeatherDescription(weather[0].description)}
          </div>
        </div>

        {/* Weather Icon */}
        <div className="flex-shrink-0">
          <img
            src={getWeatherIcon(weather[0].icon)}
            alt={weather[0].description}
            className="w-24 h-24 object-contain"
          />
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <ThermometerSun className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Min / Max</div>
            <div className="font-medium">
              {formatTemp(main.temp_min)} / {formatTemp(main.temp_max)}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Humidity</div>
            <div className="font-medium">{main.humidity}%</div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <Wind className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Wind Speed</div>
            <div className="font-medium">{(wind.speed * 3.6).toFixed(1)} km/h</div>
          </div>
        </div>
      </div>

      {/* Air Quality */}
      {aqi && (
        <div className="mt-6">
          <div className="text-sm text-gray-500 mb-2">Air Quality Index</div>
          <div className="glass-card rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium">{getAqiLabel(aqi)}</div>
              <div className={`px-3 py-1 rounded-full text-white text-sm ${getAqiColor(aqi)}`}>
                {aqi}
              </div>
            </div>
            <div className="mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full ${getAqiColor(aqi)}`} 
                style={{ width: `${(aqi / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
