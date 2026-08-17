import { WeatherIcon } from './WeatherIcon';
import type { WeatherData } from '@/lib/weather';
import { getHourFromISO } from '@/lib/weather';
import { getWeatherLabel } from '@/lib/weatherCodes';

interface HourlyForecastProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export function HourlyForecast({ data, unit }: HourlyForecastProps) {
  const now = new Date();
  const startIdx = data.hourly.time.findIndex((t) => new Date(t) >= now);
  const idx = startIdx === -1 ? 0 : Math.max(0, startIdx - 1);
  const hours = data.hourly.time.slice(idx, idx + 24);
  const unitSym = unit === 'fahrenheit' ? '°' : '°';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-50">
      <h3 className="font-semibold text-slate-700 mb-4">Prévisions horaires (24h)</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {hours.map((time, i) => {
          const hIdx = idx + i;
          const code = data.hourly.weatherCode[hIdx];
          const temp = data.hourly.temperature[hIdx];
          const precip = data.hourly.precipitationProbability[hIdx];
          const isDay = data.hourly.isDay[hIdx] === 1;
          return (
            <div
              key={time}
              className="flex flex-col items-center gap-1.5 min-w-[68px] p-2 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <span className="text-xs text-slate-400 font-medium">
                {i === 0 ? 'Maintenant' : getHourFromISO(time)}
              </span>
              <WeatherIcon code={code} isDay={isDay} className="h-8 w-8" />
              <span className="font-semibold text-slate-700 text-sm">{Math.round(temp)}{unitSym}</span>
              <span className="text-xs text-blue-400">{precip}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DailyForecastProps {
  data: WeatherData;
  unit: 'celsius' | 'fahrenheit';
}

export function DailyForecast({ data, unit }: DailyForecastProps) {
  const days = data.daily.time;
  const unitSym = unit === 'fahrenheit' ? '°F' : '°C';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-sky-50">
      <h3 className="font-semibold text-slate-700 mb-4">Prévisions sur 7 jours</h3>
      <div className="space-y-1">
        {days.map((day, i) => {
          const code = data.daily.weatherCode[i];
          const max = data.daily.temperatureMax[i];
          const min = data.daily.temperatureMin[i];
          const precip = data.daily.precipitationProbability[i];
          const precipSum = data.daily.precipitationSum[i];
          const wind = data.daily.windSpeedMax[i];
          const dayName = new Date(day).toLocaleDateString('fr-FR', { weekday: 'short' });
          const dateNum = new Date(day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'numeric' });
          const allTemps = data.daily.temperatureMax;
          const globalMax = Math.max(...allTemps);
          const globalMin = Math.min(...data.daily.temperatureMin);
          const range = globalMax - globalMin || 1;
          const barLeft = ((min - globalMin) / range) * 100;
          const barWidth = ((max - min) / range) * 100;

          return (
            <div
              key={day}
              className="flex items-center gap-3 py-2.5 px-2 rounded-xl hover:bg-sky-50 transition-colors"
            >
              <div className="w-20 shrink-0">
                <p className="font-medium text-slate-700 capitalize">{i === 0 ? "Aujourd'hui" : dayName}</p>
                <p className="text-xs text-slate-400">{dateNum}</p>
              </div>
              <WeatherIcon code={code} isDay className="h-8 w-8 shrink-0" />
              <div className="flex-1 min-w-0 hidden sm:block">
                <p className="text-xs text-slate-500 truncate">{getWeatherLabel(code)}</p>
              </div>
              <div className="hidden md:flex items-center gap-1 w-16 shrink-0">
                <span className="text-xs text-blue-400">{precip}%</span>
              </div>
              <div className="relative w-24 h-2 bg-slate-100 rounded-full shrink-0 hidden sm:block">
                <div
                  className="absolute h-2 rounded-full bg-gradient-to-r from-sky-300 to-amber-400"
                  style={{ left: `${barLeft}%`, width: `${Math.max(barWidth, 8)}%` }}
                />
              </div>
              <div className="flex items-center gap-2 w-20 justify-end shrink-0">
                <span className="text-slate-400 text-sm">{Math.round(min)}°</span>
                <span className="font-semibold text-slate-700 text-sm">{Math.round(max)}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
