import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';
import { Rating } from './Rating';
import { FavoriteButton } from './FavoriteButton';
import { cn } from '../lib/cn';

export function MovieCard({ movie, className, onOpen }) {
  const upcoming = movie.releaseDate && new Date(movie.releaseDate) > new Date();

  return (
    <Link
      to={`/movie/${movie.id}`}
      onClick={() => onOpen?.(movie)}
      className={cn('group block', className)}
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted shadow-poster transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2 group-hover:shadow-lift">
        {movie.poster ? (
          <img
            src={movie.poster}
            alt={`${movie.title} poster`}
            loading="lazy"
            className="aspect-[2/3] w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
          />
        ) : (
          <div className="grid aspect-[2/3] w-full place-items-center text-muted-foreground">
            <Film className="size-10" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute right-3 top-3 opacity-100 transition-opacity duration-300 focus-within:opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
          <FavoriteButton movie={movie} />
        </div>

        {upcoming ? (
          <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
            Coming soon
          </span>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="translate-y-2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
            <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
              <span>{movie.year ?? 'TBA'}</span>
              <span className="size-1 rounded-full bg-muted-foreground/60" />
              <Rating value={movie.rating} />
            </div>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-foreground">{movie.title}</h3>
            <span className="mt-3 inline-flex max-h-0 items-center overflow-hidden rounded-full bg-primary px-3 text-[11px] font-semibold text-primary-foreground opacity-0 transition-all duration-500 group-hover:max-h-8 group-hover:py-1.5 group-hover:opacity-100">
              View Details
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton({ className }) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
      <div className="aspect-[2/3] w-full rounded-2xl bg-muted" />
      <div className="h-3 w-3/4 rounded-full bg-muted" />
      <div className="h-3 w-1/3 rounded-full bg-muted" />
    </div>
  );
}
