import { CircularProgress } from '@mui/material';
import { MovieGrid, MovieGridSkeleton } from './MovieGrid';
import { ErrorMessage } from './ErrorMessage';
import { InfiniteSentinel } from './InfiniteSentinel';

/**
 * Renders the result of usePaginated(). `mode` picks how more pages are loaded:
 * 'infinite' (scroll sentinel) or 'button' (Load More).
 */
export function PaginatedGrid({ list, mode = 'button', empty, onOpen }) {
  const { items, loading, error, hasMore, loadMore, retry } = list;
  const firstLoad = loading && items.length === 0;

  return (
    <div>
      {firstLoad ? <MovieGridSkeleton /> : null}

      {!firstLoad && !error && items.length === 0 ? empty : null}

      {items.length > 0 ? <MovieGrid movies={items} onOpen={onOpen} /> : null}

      {error ? (
        <div className="mt-6">
          <ErrorMessage message={error} onRetry={retry} />
        </div>
      ) : null}

      {loading && items.length > 0 ? (
        <div className="mt-8 flex justify-center">
          <CircularProgress size={28} />
        </div>
      ) : null}

      {!loading && !error && hasMore && items.length > 0 ? (
        mode === 'infinite' ? (
          <InfiniteSentinel onVisible={loadMore} />
        ) : (
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={loadMore}
              className="inline-flex items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/60 hover:text-primary"
            >
              Load More
            </button>
          </div>
        )
      ) : null}
    </div>
  );
}
