import { useSearchParams } from 'react-router-dom';
import { SearchX } from 'lucide-react';
import { discoverMovies } from '../api/tmdb';
import { usePaginated } from '../lib/usePaginated';
import { useGenres } from '../lib/useGenres';
import { Filters } from '../components/Filters';
import { PaginatedGrid } from '../components/PaginatedGrid';
import { SectionHeading } from '../components/SectionHeading';
import { EmptyState } from '../components/EmptyState';

// Filters live in the URL (?genre=&year=&rating=&sort=) so views can be shared and bookmarked.
export default function Discover() {
  const [params, setParams] = useSearchParams();
  const { genres } = useGenres();

  const values = {
    genre: params.get('genre') || 'all',
    year: params.get('year') || 'all',
    rating: params.get('rating') || 'all',
    sort: params.get('sort') || 'popularity.desc',
  };

  const onChange = (name, value) => {
    const next = new URLSearchParams(params);
    if (value === 'all' || (name === 'sort' && value === 'popularity.desc')) next.delete(name);
    else next.set(name, value);
    setParams(next, { replace: true });
  };

  const list = usePaginated(
    (page) =>
      discoverMovies(
        {
          genre: values.genre,
          year: values.year,
          minRating: values.rating === 'all' ? 0 : values.rating,
          sort: values.sort,
        },
        page
      ),
    [values.genre, values.year, values.rating, values.sort]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading title="Discover" subtitle="Filter by genre, year and rating to find your next watch." />
      <div className="mb-8">
        <Filters genres={genres} values={values} onChange={onChange} />
      </div>
      <PaginatedGrid
        list={list}
        mode="button"
        empty={
          <EmptyState
            icon={<SearchX className="size-6" />}
            title="No movies match these filters"
            description="Try a different genre, year or rating."
          />
        }
      />
    </div>
  );
}
