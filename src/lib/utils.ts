
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, fromUnixTime } from "date-fns";

// Combines class names with Tailwind's utility classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format unix timestamp to readable date
export function formatUnixDate(unixTime: number, formatString: string = "EEE, MMM d") {
  return format(fromUnixTime(unixTime), formatString);
}

// Format unix timestamp to readable time
export function formatUnixTime(unixTime: number) {
  return format(fromUnixTime(unixTime), "h:mm a");
}

// Get the correct weather icon based on OpenWeatherMap icon code
export function getWeatherIcon(iconCode: string) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Get weather condition description with capitalized first letter
export function formatWeatherDescription(description: string) {
  return description.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Format temperature with degree symbol
export function formatTemp(temp: number) {
  return `${Math.round(temp)}°`;
}

// Group forecast data by day
export function groupForecastByDay(forecastList: any[]) {
  const grouped: Record<string, any[]> = {};
  
  forecastList.forEach(item => {
    const date = format(fromUnixTime(item.dt), 'yyyy-MM-dd');
    
    if (!grouped[date]) {
      grouped[date] = [];
    }
    
    grouped[date].push(item);
  });
  
  // Get daily min and max temperatures
  return Object.entries(grouped).map(([date, items]) => {
    const temperatures = items.map(item => item.main.temp);
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);
    
    // Use the noon forecast or the middle item for representing the day
    const middleIndex = Math.floor(items.length / 2);
    const representativeItem = items.find(item => {
      const hour = format(fromUnixTime(item.dt), 'H');
      return hour === '12';
    }) || items[middleIndex];
    
    return {
      date,
      dateFormatted: formatUnixDate(items[0].dt),
      minTemp,
      maxTemp,
      icon: representativeItem.weather[0].icon,
      description: representativeItem.weather[0].description,
      humidity: representativeItem.main.humidity,
      windSpeed: representativeItem.wind.speed,
      dt: representativeItem.dt,
    };
  }).slice(0, 5); // Limit to 5 days
}

// Get AQI label from index
export function getAqiLabel(aqi: number) {
  const labels = [
    "Good",
    "Fair",
    "Moderate",
    "Poor",
    "Very Poor"
  ];
  
  return labels[aqi - 1] || "Unknown";
}

// Get AQI color from index
export function getAqiColor(aqi: number) {
  const colors = [
    "bg-green-500", // Good
    "bg-green-300", // Fair
    "bg-yellow-400", // Moderate
    "bg-orange-500", // Poor
    "bg-red-500", // Very Poor
  ];
  
  return colors[aqi - 1] || "bg-gray-400";
}

// Get weather background color based on temperature
export function getTemperatureColor(temp: number) {
  if (temp <= 0) return "from-blue-800 to-blue-600";
  if (temp <= 10) return "from-blue-600 to-blue-400";
  if (temp <= 20) return "from-blue-400 to-cyan-400";
  if (temp <= 25) return "from-cyan-400 to-green-400";
  if (temp <= 30) return "from-green-400 to-yellow-400";
  return "from-yellow-400 to-orange-500";
}
