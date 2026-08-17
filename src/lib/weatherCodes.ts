interface WeatherInfo {
  label: string;
  icon: string;
}

const WMO_CODES: Record<number, WeatherInfo> = {
  0: { label: 'Ciel dégagé', icon: 'Sun' },
  1: { label: 'Ciel clair', icon: 'Sun' },
  2: { label: 'Partiellement nuageux', icon: 'CloudSun' },
  3: { label: 'Couvert', icon: 'Cloud' },
  45: { label: 'Brouillard', icon: 'CloudFog' },
  48: { label: 'Brouillard givrant', icon: 'CloudFog' },
  51: { label: 'Bruine légère', icon: 'CloudDrizzle' },
  53: { label: 'Bruine modérée', icon: 'CloudDrizzle' },
  55: { label: 'Bruine dense', icon: 'CloudDrizzle' },
  56: { label: 'Bruine verglaçante', icon: 'CloudDrizzle' },
  57: { label: 'Bruine verglaçante dense', icon: 'CloudDrizzle' },
  61: { label: 'Pluie légère', icon: 'CloudRain' },
  63: { label: 'Pluie modérée', icon: 'CloudRain' },
  65: { label: 'Pluie forte', icon: 'CloudRainWind' },
  66: { label: 'Pluie verglaçante', icon: 'CloudRain' },
  67: { label: 'Pluie verglaçante forte', icon: 'CloudRain' },
  71: { label: 'Neige légère', icon: 'CloudSnow' },
  73: { label: 'Neige modérée', icon: 'CloudSnow' },
  75: { label: 'Neige forte', icon: 'CloudSnow' },
  77: { label: 'Grains de neige', icon: 'CloudSnow' },
  80: { label: 'Averses légères', icon: 'CloudRain' },
  81: { label: 'Averses modérées', icon: 'CloudRain' },
  82: { label: 'Averses violentes', icon: 'CloudRainWind' },
  85: { label: 'Averses de neige légères', icon: 'CloudSnow' },
  86: { label: 'Averses de neige fortes', icon: 'CloudSnow' },
  95: { label: 'Orage', icon: 'CloudLightning' },
  96: { label: 'Orage avec grêle légère', icon: 'CloudLightning' },
  99: { label: 'Orage avec grêle forte', icon: 'CloudLightning' },
};

export function getWeatherInfo(code: number): WeatherInfo {
  return WMO_CODES[code] ?? { label: 'Indéterminé', icon: 'CloudOff' };
}

export function getWeatherLabel(code: number): string {
  return getWeatherInfo(code).label;
}

export function getWeatherIcon(code: number): string {
  return getWeatherInfo(code).icon;
}

export function getUvLevel(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: 'Faible', color: 'text-green-600' };
  if (uv < 6) return { label: 'Modéré', color: 'text-yellow-600' };
  if (uv < 8) return { label: 'Élevé', color: 'text-orange-600' };
  if (uv < 11) return { label: 'Très élevé', color: 'text-red-600' };
  return { label: 'Extrême', color: 'text-purple-600' };
}

export function getWindDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
  return dirs[Math.round(deg / 45) % 8];
}

export function getHumidityLevel(h: number): { label: string; color: string } {
  if (h < 30) return { label: 'Sec', color: 'text-amber-600' };
  if (h < 60) return { label: 'Confortable', color: 'text-green-600' };
  return { label: 'Humide', color: 'text-blue-600' };
}

export function getVisibilityLabel(v: number): string {
  if (v < 1000) return 'Très faible';
  if (v < 5000) return 'Faible';
  if (v < 10000) return 'Modérée';
  return 'Excellente';
}
