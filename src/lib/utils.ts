
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, fromUnixTime, parseISO } from "date-fns";

// Combines class names with Tailwind's utility classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format ISO date to readable date
export function formatISODate(isoString: string, formatString: string = "EEE, MMM d") {
  return format(parseISO(isoString), formatString);
}

// Format unix timestamp to readable date (for compatibility)
export function formatUnixDate(unixTime: number, formatString: string = "EEE, MMM d") {
  return format(fromUnixTime(unixTime), formatString);
}

// Format unix timestamp to readable time (for compatibility)
export function formatUnixTime(unixTime: number) {
  return format(fromUnixTime(unixTime), "h:mm a");
}

// Get the correct weather icon based on weather code
export function getWeatherIcon(weatherCode: number | string) {
  // Convert to number if it's a string (for compatibility with old code)
  const code = typeof weatherCode === 'string' 
    ? 800 // Default clear sky if string passed
    : Number(weatherCode);
  
  // WMO Weather interpretation codes (WW)
  // https://open-meteo.com/en/docs
  if (code === 0) return "https://openweathermap.org/img/wn/01d@2x.png"; // Clear sky
  if (code === 1) return "https://openweathermap.org/img/wn/01d@2x.png"; // Mainly clear
  if (code === 2) return "https://openweathermap.org/img/wn/02d@2x.png"; // Partly cloudy
  if (code === 3) return "https://openweathermap.org/img/wn/03d@2x.png"; // Overcast
  if (code >= 45 && code <= 48) return "https://openweathermap.org/img/wn/50d@2x.png"; // Fog
  if (code >= 51 && code <= 55) return "https://openweathermap.org/img/wn/09d@2x.png"; // Drizzle
  if (code >= 56 && code <= 57) return "https://openweathermap.org/img/wn/13d@2x.png"; // Freezing Drizzle
  if (code >= 61 && code <= 65) return "https://openweathermap.org/img/wn/10d@2x.png"; // Rain
  if (code >= 66 && code <= 67) return "https://openweathermap.org/img/wn/13d@2x.png"; // Freezing Rain
  if (code >= 71 && code <= 77) return "https://openweathermap.org/img/wn/13d@2x.png"; // Snow
  if (code >= 80 && code <= 82) return "https://openweathermap.org/img/wn/09d@2x.png"; // Rain showers
  if (code >= 85 && code <= 86) return "https://openweathermap.org/img/wn/13d@2x.png"; // Snow showers
  if (code === 95) return "https://openweathermap.org/img/wn/11d@2x.png"; // Thunderstorm
  if (code >= 96 && code <= 99) return "https://openweathermap.org/img/wn/11d@2x.png"; // Thunderstorm with hail
  
  return "https://openweathermap.org/img/wn/02d@2x.png"; // Default partly cloudy
}

// Get weather description based on weather code
export function getWeatherDescription(weatherCode: number) {
  // WMO Weather interpretation codes (WW)
  if (weatherCode === 0) return "Clear sky";
  if (weatherCode === 1) return "Mainly clear";
  if (weatherCode === 2) return "Partly cloudy";
  if (weatherCode === 3) return "Overcast";
  if (weatherCode >= 45 && weatherCode <= 48) return "Fog";
  if (weatherCode >= 51 && weatherCode <= 55) return "Drizzle";
  if (weatherCode >= 56 && weatherCode <= 57) return "Freezing Drizzle";
  if (weatherCode >= 61 && weatherCode <= 65) return "Rain";
  if (weatherCode >= 66 && weatherCode <= 67) return "Freezing Rain";
  if (weatherCode >= 71 && weatherCode <= 77) return "Snow";
  if (weatherCode >= 80 && weatherCode <= 82) return "Rain showers";
  if (weatherCode >= 85 && weatherCode <= 86) return "Snow showers";
  if (weatherCode === 95) return "Thunderstorm";
  if (weatherCode >= 96 && weatherCode <= 99) return "Thunderstorm with hail";
  
  return "Unknown";
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

// Group forecast data into daily format
export function groupForecastByDay(weatherData: any) {
  if (!weatherData?.daily) return [];
  
  const { daily, hourly } = weatherData;
  
  return daily.time.map((date: string, index: number) => {
    // Get the hourly data for the middle of the day (noon)
    const dateStr = date.split('T')[0];
    const noonHourIndex = hourly.time.findIndex((time: string) => 
      time.includes(dateStr) && time.includes('12:00')
    );
    
    // Use noon data or first hour of the day if noon not available
    const hourIndex = noonHourIndex !== -1 ? noonHourIndex : 
      hourly.time.findIndex((time: string) => time.includes(dateStr));
    
    return {
      date: dateStr,
      dateFormatted: formatISODate(date),
      minTemp: daily.temperature_2m_min[index],
      maxTemp: daily.temperature_2m_max[index],
      icon: daily.weathercode[index],
      description: getWeatherDescription(daily.weathercode[index]),
      humidity: hourly.relativehumidity_2m[hourIndex] || 0,
      windSpeed: daily.windspeed_10m_max[index] || 0,
      dt: new Date(date).getTime() / 1000, // Convert to Unix timestamp for compatibility
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
