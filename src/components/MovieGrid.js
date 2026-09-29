import { MovieCard, MovieCardSkeleton } from './MovieCard';

const GRID = 'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6';

export function MovieGrid({ movies, onOpen }) {
  return (
    <div className={GRID}>
      {movies.map((movie, i) => (
        <div key={movie.id} className="reveal" style={{ animationDelay: `${(i % 12) * 50}ms` }}>
          <MovieCard movie={movie} onOpen={onOpen} />
        </div>
      ))}
    </div>
  );
}

export function MovieGridSkeleton({ count = 12 }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}
