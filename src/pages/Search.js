import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchX, Search as SearchIcon } from 'lucide-react';
import { searchMovies } from '../api/tmdb';
import { usePaginated } from '../lib/usePaginated';
import { useMovio } from '../lib/movio-store';
import { PaginatedGrid } from '../components/PaginatedGrid';
import { SearchBar } from '../components/SearchBar';
import { SectionHeading } from '../components/SectionHeading';
import { EmptyState } from '../components/EmptyState';

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get('q') || '').trim();
  const { setLastSearch } = useMovio();

  const list = usePaginated((page) => (q ? searchMovies(q, page) : Promise.resolve({ results: [], totalPages: 1 })), [q]);

  // Remember the search and its top result so Home can offer "Continue Exploring".
  const firstMovie = list.items[0];
  useEffect(() => {
    if (q && firstMovie) setLastSearch({ query: q, movie: firstMovie });
  }, [q, firstMovie, setLastSearch]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <SearchBar />
      </div>

      {q ? (
        <>
          <SectionHeading title={`Results for “${q}”`} subtitle="Scroll down to load more results." />
          <PaginatedGrid
            list={list}
            mode="infinite"
            onOpen={(movie) => setLastSearch({ query: q, movie })}
            empty={
              <EmptyState
                icon={<SearchX className="size-6" />}
                title="No results found"
                description={`We couldn't find any movies matching “${q}”. Check the spelling or try another title.`}
              />
            }
          />
        </>
      ) : (
        <EmptyState
          icon={<SearchIcon className="size-6" />}
          title="Search for a movie"
          description="Type a title above to see matching movies."
        />
      )}
    </div>
  );
}
