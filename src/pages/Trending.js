import { fetchTrending } from '../api/tmdb';
import { usePaginated } from '../lib/usePaginated';
import { PaginatedGrid } from '../components/PaginatedGrid';
import { SectionHeading } from '../components/SectionHeading';

export default function Trending() {
  const trending = usePaginated(fetchTrending, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <SectionHeading title="Trending" subtitle="The movies everyone is talking about this week." />
      <PaginatedGrid list={trending} mode="button" />
    </div>
  );
}
