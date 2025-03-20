
import { toast } from "sonner";

// OpenWeatherMap API key
const API_KEY = "YOUR_OPENWEATHERMAP_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

// API endpoints
const ENDPOINTS = {
  WEATHER: `${BASE_URL}/weather`,
  FORECAST: `${BASE_URL}/forecast`,
  AIR_POLLUTION: `${BASE_URL}/air_pollution`,
  GEO: "https://api.openweathermap.org/geo/1.0/direct",
};

// Error handler for API calls
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  toast.error("Failed to fetch weather data. Please try again later.");
  return null;
};

// Get current weather by city name
export const getCurrentWeather = async (city: string) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.WEATHER}?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get current weather by coordinates
export const getCurrentWeatherByCoords = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get 5-day forecast by city name
export const getForecast = async (city: string) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.FORECAST}?q=${city}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get 5-day forecast by coordinates
export const getForecastByCoords = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.FORECAST}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Get air pollution data by coordinates
export const getAirPollution = async (lat: number, lon: number) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.AIR_POLLUTION}?lat=${lat}&lon=${lon}&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Geocoding - search for city coordinates
export const searchCities = async (query: string) => {
  try {
    const response = await fetch(
      `${ENDPOINTS.GEO}?q=${query}&limit=5&appid=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error);
  }
};
