
import { formatTemp, formatWeatherDescription, getWeatherIcon, getWeatherDescription } from "@/lib/utils";
import { Wind, Droplets, ThermometerSun } from "lucide-react";

interface CurrentWeatherProps {
  data: any;
  airQuality?: any;
}

export default function CurrentWeather({ data, airQuality }: CurrentWeatherProps) {
  if (!data) return null;

  const {
    current_weather,
    hourly,
    city
  } = data;

  // Get current hour data
  const currentTemp = current_weather.temperature;
  const currentHourIndex = hourly.time.findIndex((time: string) => 
    new Date(time).getHours() === new Date().getHours()
  );
  
  const currentHumidity = hourly.relativehumidity_2m[currentHourIndex] || 0;
  const currentApparentTemp = hourly.apparent_temperature[currentHourIndex] || currentTemp;
  
  // Get daily min/max from first day
  const minTemp = data.daily.temperature_2m_min[0];
  const maxTemp = data.daily.temperature_2m_max[0];
  
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

  const weatherDescription = getWeatherDescription(current_weather.weathercode);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden p-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Location and Temperature */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-medium text-gray-700">
            {city.name}, {city.country}
          </h2>
          <div className="flex items-center justify-center md:justify-start gap-4 mt-2">
            <div className="text-6xl font-light">{formatTemp(currentTemp)}</div>
            <div>
              <div className="text-sm text-gray-500">Feels like</div>
              <div className="text-xl">{formatTemp(currentApparentTemp)}</div>
            </div>
          </div>
          <div className="mt-1 text-lg text-gray-600 capitalize">
            {formatWeatherDescription(weatherDescription)}
          </div>
        </div>

        {/* Weather Icon */}
        <div className="flex-shrink-0">
          <img
            src={getWeatherIcon(current_weather.weathercode)}
            alt={weatherDescription}
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
              {formatTemp(minTemp)} / {formatTemp(maxTemp)}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Humidity</div>
            <div className="font-medium">{currentHumidity}%</div>
          </div>
        </div>

        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="p-2 rounded-full bg-blue-50">
            <Wind className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <div className="text-sm text-gray-500">Wind Speed</div>
            <div className="font-medium">{current_weather.windspeed.toFixed(1)} km/h</div>
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
