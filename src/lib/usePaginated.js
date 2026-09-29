import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '../api/tmdb';

const initial = { items: [], page: 0, totalPages: 1, loading: true, error: null };

/**
 * Loads a paginated TMDb list. `fetcher(page)` must resolve to
 * { results, totalPages }. The list resets whenever `deps` change.
 */
export function usePaginated(fetcher, deps) {
  const [state, setState] = useState(initial);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const requestId = useRef(0);

  const load = useCallback(async (page) => {
    const id = ++requestId.current; // ignore responses from stale requests
    setState((s) => ({ ...s, items: page === 1 ? [] : s.items, loading: true, error: null }));
    try {
      const data = await fetcherRef.current(page);
      if (id !== requestId.current) return;
      setState((s) => {
        const seen = new Set(s.items.map((m) => m.id));
        const fresh = data.results.filter((m) => !seen.has(m.id));
        return {
          items: [...s.items, ...fresh],
          page,
          totalPages: data.totalPages,
          loading: false,
          error: null,
        };
      });
    } catch (err) {
      if (id !== requestId.current) return;
      setState((s) => ({ ...s, loading: false, error: getErrorMessage(err) }));
    }
  }, []);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const hasMore = state.page < state.totalPages;
  const loadMore = useCallback(() => {
    if (!state.loading && !state.error && hasMore) load(state.page + 1);
  }, [state.loading, state.error, state.page, hasMore, load]);
  // Retries the page that failed (page 0 means the first page).
  const retry = useCallback(() => load(state.page + 1), [load, state.page]);

  return { ...state, hasMore, loadMore, retry };
}
