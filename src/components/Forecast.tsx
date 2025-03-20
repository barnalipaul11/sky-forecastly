
import { formatTemp, formatUnixDate, getWeatherIcon } from "@/lib/utils";
import { Droplets, Wind } from "lucide-react";

interface ForecastItem {
  date: string;
  dateFormatted: string;
  minTemp: number;
  maxTemp: number;
  icon: string;
  description: string;
  humidity: number;
  windSpeed: number;
  dt: number;
}

interface ForecastProps {
  dailyData: ForecastItem[];
}

export default function Forecast({ dailyData }: ForecastProps) {
  if (!dailyData?.length) return null;

  return (
    <div className="glass-panel rounded-2xl p-6 animate-fade-in">
      <h3 className="text-lg font-medium text-gray-700 mb-4">5-Day Forecast</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {dailyData.map((day) => (
          <div 
            key={day.date}
            className="glass-card rounded-xl p-4 card-hover flex flex-col items-center"
          >
            <div className="text-sm font-medium">{day.dateFormatted}</div>
            
            <img 
              src={getWeatherIcon(day.icon)} 
              alt={day.description}
              className="weather-icon my-2"
            />
            
            <div className="text-xs text-gray-500 capitalize mb-3 text-center">
              {day.description}
            </div>
            
            <div className="flex justify-between w-full text-sm mb-3">
              <span className="font-medium">{formatTemp(day.minTemp)}</span>
              <span className="font-medium">{formatTemp(day.maxTemp)}</span>
            </div>
            
            <div className="flex justify-between w-full text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Droplets size={12} />
                <span>{day.humidity}%</span>
              </div>
              <div className="flex items-center gap-1">
                <Wind size={12} />
                <span>{(day.windSpeed * 3.6).toFixed(1)} km/h</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
