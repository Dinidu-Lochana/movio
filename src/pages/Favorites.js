import { Heart } from 'lucide-react';
import { useMovio } from '../lib/movio-store';
import { MovieGrid } from '../components/MovieGrid';
import { SectionHeading } from '../components/SectionHeading';
import { EmptyState } from '../components/EmptyState';

export default function Favorites() {
  const { favorites } = useMovio();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading
        title="Favorites"
        subtitle={favorites.length ? `${favorites.length} saved on this device.` : 'Movies you save appear here.'}
      />
      {favorites.length > 0 ? (
        <MovieGrid movies={favorites} />
      ) : (
        <EmptyState
          icon={<Heart className="size-6" />}
          title="No favorites yet"
          description="Tap the heart on any movie to save it to your list."
          ctaLabel="Browse trending"
          ctaTo="/trending"
        />
      )}
    </div>
  );
}
