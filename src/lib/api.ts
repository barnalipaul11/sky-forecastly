
import { toast } from "sonner";

// Open-Meteo API (Free, no API key required)
const BASE_URL = "https://api.open-meteo.com/v1";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1";

// API endpoints
const ENDPOINTS = {
  FORECAST: `${BASE_URL}/forecast`,
  GEO: `${GEO_URL}/search`,
};

// Error handler for API calls
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  toast.error("Failed to fetch weather data. Please try again later.");
  return null;
};

// Get weather data by coordinates
export const getWeatherData = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.FORECAST}?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_probability_max,windspeed_10m_max&current_weather=true&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get weather data by city name
export const getCurrentWeather = async (city: string) => {
  try {
    // First get coordinates for the city
    const geoData = await searchCities(city);
    
    if (!geoData || !geoData.length) {
      throw new Error("City not found");
    }
    
    // Then get weather data for those coordinates
    const firstResult = geoData[0];
    const weatherData = await getWeatherData(firstResult.latitude, firstResult.longitude);
    
    // Add city information to the weather data
    return {
      ...weatherData,
      city: {
        name: firstResult.name,
        country: firstResult.country,
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
      }
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Get weather data by coordinates
export const getCurrentWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const weatherData = await getWeatherData(lat, lon);
    
    // Get location name from coordinates using reverse geocoding
    const response = await fetch(
      `${ENDPOINTS.GEO}?latitude=${lat}&longitude=${lon}&count=1`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const geoData = await response.json();
    
    // Add city information to the weather data
    return {
      ...weatherData,
      city: {
        name: geoData.results?.[0]?.name || "Unknown",
        country: geoData.results?.[0]?.country || "Unknown",
        latitude: lat,
        longitude: lon,
      }
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Search for cities
export const searchCities = async (query: string) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.GEO}?name=${query}&count=5`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.results || [];
  } catch (error) {
    return handleApiError(error);
  }
};

// These functions are kept for API compatibility with existing code
export const getForecast = getCurrentWeather;
export const getForecastByCoords = getCurrentWeatherByCoords;
export const getAirPollution = async (lat: number, lon: number) => {
  // Open-Meteo doesn't have air pollution data in the free tier
  // We'll return a simplified version with a default value
  return {
    list: [
      {
        main: {
          aqi: 2 // Default to "Fair" air quality
        }
      }
    ]
  };
};
