import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MovieCard } from './MovieCard';

const arrowClass =
  'grid size-10 place-items-center rounded-full border border-border bg-surface text-foreground transition-colors hover:border-primary/60 hover:text-primary';

export function MovieCarousel({ movies }) {
  const trackRef = useRef(null);

  const scrollBy = (direction) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * Math.min(el.clientWidth * 0.8, 900), behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar -mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-2"
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            className="w-[44vw] shrink-0 snap-start sm:w-56 lg:w-60"
          />
        ))}
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={() => scrollBy(-1)} aria-label="Scroll left" className={arrowClass}>
          <ChevronLeft className="size-4" />
        </button>
        <button type="button" onClick={() => scrollBy(1)} aria-label="Scroll right" className={arrowClass}>
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
