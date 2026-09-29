import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useMovio } from '../lib/movio-store';
import { cn } from '../lib/cn';

export function FavoriteButton({ movie, variant = 'icon', className }) {
  const { isFavorite, toggleFavorite } = useMovio();
  const active = isFavorite(movie.id);
  const [popping, setPopping] = useState(false);

  const onClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(movie);
    setPopping(true);
    window.setTimeout(() => setPopping(false), 460);
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(
          'inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-5 py-3 text-sm font-semibold text-foreground transition-all duration-300 hover:border-primary/60 hover:bg-surface',
          active && 'border-primary/60 text-primary',
          className
        )}
      >
        <Heart className={cn('size-4', active && 'fill-primary text-primary', popping && 'heart-pop')} />
        {active ? 'In Favorites' : 'Add to Favorites'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={active}
      className={cn(
        'grid size-9 place-items-center rounded-full border border-border bg-background/70 backdrop-blur transition-all duration-300 hover:border-primary/60 hover:bg-background',
        className
      )}
    >
      <Heart
        className={cn(
          'size-4 text-foreground/80 transition-colors',
          active && 'fill-primary text-primary',
          popping && 'heart-pop'
        )}
      />
    </button>
  );
}
