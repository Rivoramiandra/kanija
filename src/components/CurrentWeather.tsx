import {
  Wind, Droplets, Gauge, Cloud, Eye, Sun, Compass,
  ThermometerSun, Sunrise, Sunset,
} from 'lucide-react';
import type { WeatherData, GeoLocation } from '@/lib/weather';
import { WeatherIcon } from './WeatherIcon';
import {
  getWeatherLabel, getUvLevel, getWindDirection,
  getHumidityLevel, getVisibilityLabel,
} from '@/lib/weatherCodes';

interface CurrentWeatherProps {
  data: WeatherData;
  location: GeoLocation;
  unit: 'celsius' | 'fahrenheit';
}

export function CurrentWeather({ data, location, unit }: CurrentWeatherProps) {
  const c = data.current;
  const unitSym = unit === 'fahrenheit' ? '°F' : '°C';
  const windUnit = unit === 'fahrenheit' ? 'mph' : 'km/h';
  const uv = getUvLevel(c.uvIndex);
  const hum = getHumidityLevel(c.humidity);
  const vis = getVisibilityLabel(c.visibility);
  const windDir = getWindDirection(c.windDirection);

  const now = new Date(c.time);
  const dateStr = now.toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long',
  });
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Compass className="h-5 w-5" />
              {location.name}
            </h2>
            <p className="text-sky-100 text-sm mt-1">
              {location.admin1 ? `${location.admin1}, ` : ''}{location.country}
            </p>
            <p className="text-sky-100 text-sm capitalize">{dateStr} · {timeStr}</p>
          </div>
          <div className="text-right">
            <WeatherIcon code={c.weatherCode} isDay={c.isDay} className="h-20 w-20 drop-shadow-lg" />
          </div>
        </div>

        <div className="flex items-end gap-4 mb-2">
          <span className="text-7xl font-extralight tracking-tighter">
            {Math.round(c.temperature)}°
          </span>
          <span className="text-xl text-sky-100 mb-3">{unitSym}</span>
        </div>
        <p className="text-lg font-medium mb-1">{getWeatherLabel(c.weatherCode)}</p>
        <p className="text-sky-100 text-sm mb-6">
          Ressenti {Math.round(c.apparentTemperature)}{unitSym}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <DetailChip icon={Wind} label="Vent" value={`${Math.round(c.windSpeed)} ${windUnit}`} sub={windDir} />
          <DetailChip icon={Droplets} label="Humidité" value={`${c.humidity}%`} sub={hum.label} />
          <DetailChip icon={Gauge} label="Pression" value={`${Math.round(c.pressure)} hPa`} />
          <DetailChip icon={Cloud} label="Nuages" value={`${c.cloudCover}%`} />
          <DetailChip icon={Eye} label="Visibilité" value={vis} sub={`${c.visibility / 1000 | 0} km`} />
          <DetailChip icon={Sun} label="Indice UV" value={`${c.uvIndex.toFixed(1)}`} sub={uv.label} />
          <DetailChip icon={ThermometerSun} label="Rafales" value={`${Math.round(c.windGusts)} ${windUnit}`} />
          <DetailChip icon={Droplets} label="Précip." value={`${c.precipitation} mm`} />
        </div>
      </div>
    </div>
  );
}

function DetailChip({
  icon: Icon, label, value, sub,
}: {
  icon: typeof Wind;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-3 flex items-center gap-3">
      <Icon className="h-5 w-5 text-sky-100 shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-sky-100">{label}</p>
        <p className="font-semibold text-sm truncate">{value}</p>
        {sub && <p className="text-xs text-sky-100 truncate">{sub}</p>}
      </div>
    </div>
  );
}

export function SunInfo({ data }: { data: WeatherData }) {
  const sunrise = data.daily.sunrise[0];
  const sunset = data.daily.sunset[0];
  const fmt = (iso: string) => new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-50 flex items-center justify-around">
      <div className="flex items-center gap-3">
        <Sunrise className="h-8 w-8 text-amber-400" />
        <div>
          <p className="text-xs text-slate-400">Lever</p>
          <p className="font-semibold text-slate-700">{fmt(sunrise)}</p>
        </div>
      </div>
      <div className="h-10 w-px bg-slate-100" />
      <div className="flex items-center gap-3">
        <Sunset className="h-8 w-8 text-orange-400" />
        <div>
          <p className="text-xs text-slate-400">Coucher</p>
          <p className="font-semibold text-slate-700">{fmt(sunset)}</p>
        </div>
      </div>
    </div>
  );
}
