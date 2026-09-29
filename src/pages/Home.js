import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, Info, ArrowRight, Clapperboard } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { CarouselSkeleton, ChipsSkeleton, HeroSkeleton } from '../components/Skeletons';
import { fetchMovie, fetchPopular, fetchTrending, fetchUpcoming, getErrorMessage } from '../api/tmdb';
import { useMovio } from '../lib/movio-store';
import { usePaginated } from '../lib/usePaginated';
import { useGenres } from '../lib/useGenres';
import { MovieCarousel } from '../components/MovieCarousel';
import { MovieGrid, MovieGridSkeleton } from '../components/MovieGrid';
import { PaginatedGrid } from '../components/PaginatedGrid';
import { SectionHeading } from '../components/SectionHeading';
import { TrailerModal } from '../components/TrailerModal';
import { FavoriteButton } from '../components/FavoriteButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { Rating } from '../components/Rating';

const dot = <span className="size-1 rounded-full bg-muted-foreground/60" />;

function Hero({ movie, genreNames }) {
  const [trailer, setTrailer] = useState({ open: false, id: null, loading: false, error: '' });

  // The trailer key is only in the details endpoint, so fetch it on demand.
  const watchTrailer = async () => {
    setTrailer((t) => ({ ...t, loading: true, error: '' }));
    try {
      const details = await fetchMovie(movie.id);
      if (details.trailerId) {
        setTrailer({ open: true, id: details.trailerId, loading: false, error: '' });
      } else {
        setTrailer({ open: false, id: null, loading: false, error: 'No trailer is available for this movie.' });
      }
    } catch (err) {
      setTrailer({ open: false, id: null, loading: false, error: getErrorMessage(err) });
    }
  };

  return (
    <section className="relative isolate min-h-[88vh] overflow-hidden">
      {movie.backdrop ? (
        <img src={movie.backdrop} alt="" className="slow-pan absolute inset-0 size-full object-cover" />
      ) : null}
      <div className="hero-fade absolute inset-0" />
      <div className="hero-fade-side absolute inset-0" />

      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6">
        <div className="max-w-2xl">
          <p
            className="reveal text-xs font-semibold uppercase tracking-[0.3em] text-primary"
            style={{ animationDelay: '80ms' }}
          >
            Trending this week
          </p>
          <h1
            className="reveal mt-4 text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl lg:text-7xl"
            style={{ animationDelay: '160ms' }}
          >
            {movie.title}
          </h1>
          <div
            className="reveal mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground"
            style={{ animationDelay: '240ms' }}
          >
            <Rating value={movie.rating} />
            {dot}
            <span>{movie.year ?? 'TBA'}</span>
            {genreNames.length > 0 ? (
              <>
                {dot}
                <span>{genreNames.join(' · ')}</span>
              </>
            ) : null}
          </div>
          <p
            className="reveal mt-5 line-clamp-4 max-w-xl text-base leading-relaxed text-foreground/80"
            style={{ animationDelay: '320ms' }}
          >
            {movie.overview}
          </p>

          <div className="reveal mt-8 flex flex-wrap items-center gap-3" style={{ animationDelay: '400ms' }}>
            <button
              type="button"
              onClick={watchTrailer}
              disabled={trailer.loading}
              className="glow-primary inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105 disabled:opacity-70"
            >
              {trailer.loading ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Play className="size-4 fill-current" />
              )}
              Watch Trailer
            </button>
            <Link
              to={`/movie/${movie.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:border-primary/60"
            >
              <Info className="size-4" />
              View Details
            </Link>
            <FavoriteButton movie={movie} variant="pill" />
          </div>
          {trailer.error ? <p className="mt-3 text-sm text-muted-foreground">{trailer.error}</p> : null}
        </div>
      </div>

      <TrailerModal
        open={trailer.open}
        onClose={() => setTrailer((t) => ({ ...t, open: false }))}
        title={movie.title}
        trailerId={trailer.id}
      />
    </section>
  );
}

export default function Home() {
  const { lastSearch } = useMovio();
  const { genres, nameById } = useGenres();
  const trending = usePaginated(fetchTrending, []);
  const popular = usePaginated(fetchPopular, []);
  const upcoming = usePaginated(fetchUpcoming, []);

  const hero = trending.items.find((m) => m.backdrop);
  const lastMovie = lastSearch?.movie;

  return (
    <>
      {hero ? (
        <Hero movie={hero} genreNames={hero.genreIds.map(nameById).filter(Boolean).slice(0, 3)} />
      ) : trending.error ? (
        <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
          <ErrorMessage message={trending.error} onRetry={trending.retry} />
        </div>
      ) : (
        <HeroSkeleton />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {lastMovie ? (
          <section className="mb-20 pt-16">
            <SectionHeading
              title="Continue Exploring"
              subtitle={`Picking up from your search for “${lastSearch.query}”.`}
            />
            <div className="flex flex-wrap items-center gap-5 rounded-3xl border border-border bg-surface/60 p-5">
              {lastMovie.poster ? (
                <img src={lastMovie.poster} alt="" className="h-28 w-20 rounded-xl object-cover" />
              ) : null}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-foreground">{lastMovie.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <Rating value={lastMovie.rating} />
                  <span>· {lastMovie.year ?? 'TBA'}</span>
                </div>
              </div>
              <div className="ml-auto flex flex-wrap gap-2">
                <Link
                  to={`/search?q=${encodeURIComponent(lastSearch.query)}`}
                  className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
                >
                  See results
                </Link>
                <Link
                  to={`/movie/${lastMovie.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  View Details <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mb-20 pt-10">
          <SectionHeading
            title="Trending Now"
            subtitle="See what everyone is watching."
            action={
              <Link to="/trending" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                View all <ArrowRight className="size-4" />
              </Link>
            }
          />
          {trending.items.length > 0 ? <MovieCarousel movies={trending.items} /> : <CarouselSkeleton />}
        </section>

        <section className="mb-20">
          <SectionHeading title="Browse by Genre" subtitle="Pick a mood, we'll do the rest." />
          {genres.length === 0 ? <ChipsSkeleton /> : null}
          <div className="flex flex-wrap gap-2.5">
            {genres.map((genre) => (
              <Link
                key={genre.id}
                to={`/discover?genre=${genre.id}`}
                className="group relative overflow-hidden rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary/60 hover:text-primary"
              >
                <span className="absolute inset-0 origin-left scale-x-0 bg-primary/10 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <span className="relative">{genre.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-20">
          <SectionHeading title="Popular Movies" subtitle="Most watched across Movio right now." />
          <PaginatedGrid list={popular} mode="button" />
        </section>

        <section className="mb-4">
          <SectionHeading title="Coming Soon" subtitle="On the way to a screen near you." />
          <div className="rounded-3xl border border-primary/25 bg-primary/5 p-5 sm:p-7">
            {upcoming.error ? (
              <ErrorMessage message={upcoming.error} onRetry={upcoming.retry} />
            ) : upcoming.items.length > 0 ? (
              <MovieGrid movies={upcoming.items.slice(0, 6)} />
            ) : (
              <MovieGridSkeleton count={6} />
            )}
          </div>
        </section>

        <section className="mb-4 py-16 text-center">
          <Clapperboard className="mx-auto size-8 text-primary" />
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            There is always something worth discovering.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
            Filter by genre, rating and release year to find exactly the kind of night you're in the mood for.
          </p>
          <Link
            to="/discover"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
          >
            Discover Movies <ArrowRight className="size-4" />
          </Link>
        </section>
      </div>
    </>
  );
}
