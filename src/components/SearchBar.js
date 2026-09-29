import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchMovies } from '../api/tmdb';
import { useMovio } from '../lib/movio-store';
import { Rating } from './Rating';

/** Search input with debounced live suggestions. Submitting opens /search?q=... */
export function SearchBar({ onDone, autoFocus }) {
  const navigate = useNavigate();
  const { setLastSearch } = useMovio();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Debounce so we don't hit the API on every keystroke.
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return undefined;
    }
    let active = true;
    const timer = setTimeout(() => {
      searchMovies(q)
        .then((data) => active && setSuggestions(data.results.slice(0, 5)))
        .catch(() => active && setSuggestions([])); // suggestions are optional; fail silently
    }, 350);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  const submit = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    onDone?.();
  };

  const pick = (movie) => {
    setLastSearch({ query: query.trim(), movie });
    onDone?.();
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-3 focus-within:border-primary/60">
        <Search className="size-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies by title..."
          aria-label="Search movies"
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground"
        >
          Search
        </button>
      </div>

      {suggestions.length > 0 ? (
        <ul className="mt-3 overflow-hidden rounded-2xl border border-border bg-surface">
          {suggestions.map((movie) => (
            <li key={movie.id}>
              <Link
                to={`/movie/${movie.id}`}
                onClick={() => pick(movie)}
                className="flex items-center gap-3 px-3 py-2.5 transition-colors hover:bg-secondary"
              >
                {movie.poster ? (
                  <img src={movie.poster} alt="" className="h-14 w-10 rounded-md object-cover" />
                ) : (
                  <div className="h-14 w-10 rounded-md bg-muted" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-foreground">{movie.title}</span>
                  <span className="text-xs text-muted-foreground">{movie.year ?? 'TBA'}</span>
                </span>
                <Rating value={movie.rating} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
