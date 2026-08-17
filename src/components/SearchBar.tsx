import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2, X } from 'lucide-react';
import { searchCities, type GeoLocation } from '@/lib/weather';

interface SearchBarProps {
  onSelect: (loc: GeoLocation) => void;
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const r = await searchCities(query);
        setResults(r);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 350);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSelect = (loc: GeoLocation) => {
    onSelect(loc);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-sky-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          placeholder="Rechercher une ville..."
          className="w-full pl-12 pr-10 py-3 rounded-full bg-white/90 backdrop-blur-sm border border-sky-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-slate-700 placeholder:text-slate-400 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {open && (results.length > 0 || loading) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-sky-100 overflow-hidden z-50">
          {loading && (
            <div className="flex items-center justify-center py-4 text-sky-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
          {!loading && results.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-sky-50 transition-colors text-left border-b border-slate-50 last:border-0"
            >
              <MapPin className="h-4 w-4 text-sky-400 shrink-0" />
              <div className="min-w-0">
                <p className="font-medium text-slate-700 truncate">{loc.name}</p>
                <p className="text-sm text-slate-400 truncate">
                  {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
