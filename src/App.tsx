import { useState, useEffect, useCallback } from 'react';
import { CloudSun, AlertCircle, Loader2 } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { CurrentWeather, SunInfo } from '@/components/CurrentWeather';
import { HourlyForecast, DailyForecast } from '@/components/Forecast';
import {
  FavoriteButton, UnitToggle, GeolocationButton, FavoriteList,
} from '@/components/Controls';
import { fetchWeather, type GeoLocation, type WeatherData } from '@/lib/weather';

const STORAGE_KEY = 'meteo-favorites';
const UNIT_KEY = 'meteo-unit';

const DEFAULT_LOCATION: GeoLocation = {
  id: 2988507,
  name: 'Paris',
  latitude: 48.8534,
  longitude: 2.3488,
  country: 'France',
  admin1: 'Île-de-France',
  timezone: 'Europe/Paris',
};

export default function App() {
  const [location, setLocation] = useState<GeoLocation>(DEFAULT_LOCATION);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'celsius' | 'fahrenheit'>(() => {
    return (localStorage.getItem(UNIT_KEY) as 'celsius' | 'fahrenheit') || 'celsius';
  });
  const [favorites, setFavorites] = useState<GeoLocation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [geoLoading, setGeoLoading] = useState(false);

  const loadWeather = useCallback(async (loc: GeoLocation, u: 'celsius' | 'fahrenheit') => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchWeather(loc.latitude, loc.longitude, u);
      setWeather(data);
    } catch (e) {
      setError('Impossible de charger la météo. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeather(location, unit);
  }, [location, unit, loadWeather]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  const isFavorite = favorites.some((f) => f.id === location.id);

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((f) => f.id !== location.id));
    } else {
      setFavorites([...favorites, location]);
    }
  };

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((f) => f.id !== id));
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const loc: GeoLocation = {
          id: Date.now(),
          name: 'Ma position',
          latitude,
          longitude,
          country: '',
          timezone: 'auto',
        };
        setLocation(loc);
        setGeoLoading(false);
      },
      () => {
        setError('Impossible d\'obtenir votre position.');
        setGeoLoading(false);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-blue-50">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sky-100">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <CloudSun className="h-8 w-8 text-sky-500" />
              <h1 className="text-xl font-bold text-slate-700">Météo</h1>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <SearchBar onSelect={setLocation} />
              <UnitToggle unit={unit} onToggle={() => setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius')} />
              <GeolocationButton onLocate={handleLocate} loading={geoLoading} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-5">
        <FavoriteList
          favorites={favorites}
          activeId={location.id}
          onSelect={setLocation}
          onRemove={removeFavorite}
        />

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {loading && !weather && (
          <div className="flex flex-col items-center justify-center py-24 text-sky-500">
            <Loader2 className="h-10 w-10 animate-spin mb-3" />
            <p className="text-slate-500">Chargement de la météo...</p>
          </div>
        )}

        {weather && (
          <>
            <div className="flex justify-end">
              <FavoriteButton
                location={location}
                isFavorite={isFavorite}
                onToggle={toggleFavorite}
              />
            </div>
            <CurrentWeather data={weather} location={location} unit={unit} />
            <SunInfo data={weather} />
            <HourlyForecast data={weather} unit={unit} />
            <DailyForecast data={weather} unit={unit} />
          </>
        )}
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-6 text-center text-sm text-slate-400">
        Données fournies par Open-Meteo · Mise à jour automatique
      </footer>
    </div>
  );
}
