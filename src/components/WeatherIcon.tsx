import {
  Sun, Cloud, CloudSun, CloudRain, CloudRainWind, CloudSnow,
  CloudFog, CloudDrizzle, CloudLightning, CloudOff, type LucideIcon,
} from 'lucide-react';
import { getWeatherIcon } from '@/lib/weatherCodes';

const ICON_MAP: Record<string, LucideIcon> = {
  Sun, Cloud, CloudSun, CloudRain, CloudRainWind, CloudSnow,
  CloudFog, CloudDrizzle, CloudLightning, CloudOff,
};

export function WeatherIcon({
  code,
  isDay = true,
  className = 'h-10 w-10',
}: {
  code: number;
  isDay?: boolean;
  className?: string;
}) {
  const iconName = getWeatherIcon(code);
  const Icon = ICON_MAP[iconName] ?? CloudOff;
  const colorClass = getColorClass(code, isDay);
  return <Icon className={`${className} ${colorClass}`} />;
}

function getColorClass(code: number, isDay: boolean): string {
  if (code === 0 || code === 1) return isDay ? 'text-amber-400' : 'text-indigo-300';
  if (code === 2) return 'text-sky-400';
  if (code === 3) return 'text-slate-400';
  if (code === 45 || code === 48) return 'text-slate-400';
  if (code >= 51 && code <= 67) return 'text-blue-400';
  if (code >= 71 && code <= 86) return 'text-cyan-300';
  if (code >= 95) return 'text-violet-400';
  return 'text-sky-400';
}
