export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  timezone: string;
}

export interface CurrentWeather {
  time: string;
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  humidity: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  isDay: boolean;
  uvIndex: number;
  visibility: number;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  weatherCode: number[];
  precipitationProbability: number[];
  isDay: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  precipitationSum: number[];
  precipitationProbability: number[];
  windSpeedMax: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast;
  daily: DailyForecast;
}

export async function searchCities(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=fr&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur lors de la recherche');
  const data = await res.json();
  return (data.results ?? []).map((r: any) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country ?? '',
    admin1: r.admin1,
    timezone: r.timezone ?? 'auto',
  }));
}

export async function fetchWeather(lat: number, lon: number, unit: 'celsius' | 'fahrenheit'): Promise<WeatherData> {
  const tempUnit = unit === 'fahrenheit' ? 'fahrenheit' : 'celsius';
  const windUnit = unit === 'fahrenheit' ? 'mph' : 'kmh';
  const precipUnit = unit === 'fahrenheit' ? 'inch' : 'mm';
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index,visibility',
    hourly: 'temperature_2m,weather_code,precipitation_probability,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,sunrise,sunset,uv_index_max',
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: tempUnit,
    wind_speed_unit: windUnit,
    precipitation_unit: precipUnit,
  });
  const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Erreur lors de la récupération météo');
  const d = await res.json();
  const c = d.current;
  return {
    current: {
      time: c.time,
      temperature: c.temperature_2m,
      apparentTemperature: c.apparent_temperature,
      weatherCode: c.weather_code,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      windGusts: c.wind_gusts_10m,
      humidity: c.relative_humidity_2m,
      pressure: c.pressure_msl,
      cloudCover: c.cloud_cover,
      precipitation: c.precipitation,
      isDay: c.is_day === 1,
      uvIndex: c.uv_index,
      visibility: c.visibility,
    },
    hourly: {
      time: d.hourly.time,
      temperature: d.hourly.temperature_2m,
      weatherCode: d.hourly.weather_code,
      precipitationProbability: d.hourly.precipitation_probability,
      isDay: d.hourly.is_day,
    },
    daily: {
      time: d.daily.time,
      weatherCode: d.daily.weather_code,
      temperatureMax: d.daily.temperature_2m_max,
      temperatureMin: d.daily.temperature_2m_min,
      precipitationSum: d.daily.precipitation_sum,
      precipitationProbability: d.daily.precipitation_probability_max,
      windSpeedMax: d.daily.wind_speed_10m_max,
      sunrise: d.daily.sunrise,
      sunset: d.daily.sunset,
      uvIndexMax: d.daily.uv_index_max,
    },
  };
}

export function getHourFromISO(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export function getDayName(dateStr: string, short = false): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { weekday: short ? 'short' : 'long' });
}
