import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Global app state (Context API): theme, favorites, last search and the signed-in
// user. Everything is persisted to localStorage.

const MovioContext = createContext(null);

const KEYS = {
  theme: 'movio.theme',
  favorites: 'movio.favorites',
  lastSearch: 'movio.lastSearch',
  user: 'movio.user',
};

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode, quota) - state still works in memory */
  }
}

export function MovioProvider({ children }) {
  const [theme, setTheme] = useState(() => read(KEYS.theme, 'dark'));
  // Favorites are stored as full movie objects so the Favorites page needs no API calls.
  const [favorites, setFavorites] = useState(() =>
    read(KEYS.favorites, []).filter((f) => f && typeof f === 'object')
  );
  // { query, movie } - the user's last searched movie.
  const [lastSearch, setLastSearch] = useState(() => read(KEYS.lastSearch, null));
  const [username, setUsername] = useState(() => read(KEYS.user, ''));

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light');
    write(KEYS.theme, theme);
  }, [theme]);
  useEffect(() => write(KEYS.favorites, favorites), [favorites]);
  useEffect(() => write(KEYS.lastSearch, lastSearch), [lastSearch]);
  useEffect(() => write(KEYS.user, username), [username]);

  const toggleFavorite = useCallback((movie) => {
    setFavorites((prev) =>
      prev.some((f) => f.id === movie.id) ? prev.filter((f) => f.id !== movie.id) : [movie, ...prev]
    );
  }, []);

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
      favorites,
      isFavorite: (id) => favorites.some((f) => f.id === id),
      toggleFavorite,
      lastSearch,
      setLastSearch,
      signedIn: Boolean(username),
      username,
      signIn: setUsername,
      signOut: () => setUsername(''),
    }),
    [theme, favorites, lastSearch, username, toggleFavorite]
  );

  return <MovioContext.Provider value={value}>{children}</MovioContext.Provider>;
}

export function useMovio() {
  const ctx = useContext(MovioContext);
  if (!ctx) throw new Error('useMovio must be used inside MovioProvider');
  return ctx;
}
