import { useEffect, useState } from 'react';
import { fetchGenres } from '../api/tmdb';

// Genres rarely change, so fetch them once per session and share the result.
let cache = null;
let inflight = null;

export function useGenres() {
  const [genres, setGenres] = useState(cache || []);

  useEffect(() => {
    if (cache) return undefined;
    let active = true;
    inflight = inflight || fetchGenres();
    inflight
      .then((data) => {
        cache = data;
        if (active) setGenres(data);
      })
      .catch(() => {
        inflight = null; // allow a retry on next mount; the UI degrades gracefully
      });
    return () => {
      active = false;
    };
  }, []);

  const nameById = (id) => genres.find((g) => g.id === id)?.name;
  return { genres, nameById };
}
