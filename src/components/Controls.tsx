import { Star, StarOff, Locate, Loader2 } from 'lucide-react';
import type { GeoLocation } from '@/lib/weather';

interface FavoriteButtonProps {
  location: GeoLocation;
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-sm transition-all shadow-sm ${
        isFavorite
          ? 'bg-amber-400 text-white hover:bg-amber-500'
          : 'bg-white text-slate-600 hover:bg-sky-50 border border-sky-100'
      }`}
    >
      {isFavorite ? <Star className="h-4 w-4 fill-white" /> : <StarOff className="h-4 w-4" />}
      {isFavorite ? 'Favori' : 'Ajouter'}
    </button>
  );
}

interface UnitToggleProps {
  unit: 'celsius' | 'fahrenheit';
  onToggle: () => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <div className="flex items-center bg-white rounded-full p-1 shadow-sm border border-sky-100">
      <button
        onClick={() => unit !== 'celsius' && onToggle()}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          unit === 'celsius' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => unit !== 'fahrenheit' && onToggle()}
        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          unit === 'fahrenheit' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        °F
      </button>
    </div>
  );
}

interface GeolocationButtonProps {
  onLocate: () => void;
  loading: boolean;
}

export function GeolocationButton({ onLocate, loading }: GeolocationButtonProps) {
  return (
    <button
      onClick={onLocate}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white text-slate-600 hover:bg-sky-50 border border-sky-100 font-medium text-sm transition-all shadow-sm disabled:opacity-50"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
      Ma position
    </button>
  );
}

interface FavoriteListProps {
  favorites: GeoLocation[];
  activeId?: number;
  onSelect: (loc: GeoLocation) => void;
  onRemove: (id: number) => void;
}

export function FavoriteList({ favorites, activeId, onSelect, onRemove }: FavoriteListProps) {
  if (favorites.length === 0) return null;
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className={`flex items-center gap-2 px-3 py-2 rounded-full shrink-0 cursor-pointer transition-all ${
            activeId === fav.id
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-white text-slate-600 border border-sky-100 hover:bg-sky-50'
          }`}
          onClick={() => onSelect(fav)}
        >
          <span className="text-sm font-medium">{fav.name}</span>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(fav.id); }}
            className="opacity-60 hover:opacity-100 transition-opacity"
          >
            <StarOff className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
