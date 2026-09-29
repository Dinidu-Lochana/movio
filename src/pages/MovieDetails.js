import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Play, ExternalLink } from 'lucide-react';
import { fetchMovie, getErrorMessage } from '../api/tmdb';
import { formatDate, formatRuntime } from '../api/normalize';
import { MovieCarousel } from '../components/MovieCarousel';
import { SectionHeading } from '../components/SectionHeading';
import { TrailerModal } from '../components/TrailerModal';
import { FavoriteButton } from '../components/FavoriteButton';
import { ErrorMessage } from '../components/ErrorMessage';
import { Rating } from '../components/Rating';
import { DetailsSkeleton } from '../components/Skeletons';

const dot = <span className="size-1 rounded-full bg-muted-foreground/60" />;

function Fact({ label, children }) {
  if (!children) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm text-foreground">{children}</dd>
    </div>
  );
}

export default function MovieDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ movie: null, loading: true, error: null });
  const [trailerOpen, setTrailerOpen] = useState(false);

  const load = useCallback(() => {
    let active = true;
    setState({ movie: null, loading: true, error: null });
    fetchMovie(id)
      .then((movie) => active && setState({ movie, loading: false, error: null }))
      .catch((err) => active && setState({ movie: null, loading: false, error: getErrorMessage(err) }));
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => load(), [load]);

  const { movie, loading, error } = state;

  useEffect(() => {
    if (movie) document.title = `${movie.title} — Movio`;
    return () => {
      document.title = 'Movio — Discover your next favorite movie';
    };
  }, [movie]);

  if (loading) {
    return <DetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <ErrorMessage message={error} onRetry={load} />
        <Link to="/" className="mt-6 inline-block text-sm font-semibold text-primary">
          ← Back to home
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative isolate overflow-hidden">
        {movie.backdrop ? (
          <img src={movie.backdrop} alt="" className="absolute inset-0 size-full object-cover opacity-60" />
        ) : null}
        <div className="hero-fade absolute inset-0" />
        <div className="hero-fade-side absolute inset-0" />

        <div className="relative mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-16 sm:px-6 md:grid-cols-[280px_1fr] md:pt-24">
          {movie.poster ? (
            <img
              src={movie.poster}
              alt={`${movie.title} poster`}
              className="reveal mx-auto w-56 rounded-2xl shadow-lift md:w-full"
            />
          ) : (
            <div className="mx-auto aspect-[2/3] w-56 rounded-2xl bg-muted md:w-full" />
          )}

          <div className="self-end">
            <h1 className="reveal text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
              {movie.title}
            </h1>
            {movie.tagline ? <p className="mt-2 italic text-muted-foreground">{movie.tagline}</p> : null}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <Rating value={movie.rating} />
              <span>({movie.votes.toLocaleString()} votes)</span>
              {movie.year ? (
                <>
                  {dot}
                  <span>{movie.year}</span>
                </>
              ) : null}
              {movie.runtime ? (
                <>
                  {dot}
                  <span>{formatRuntime(movie.runtime)}</span>
                </>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <Link
                  key={g.id}
                  to={`/discover?genre=${g.id}`}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <h2 className="mt-6 text-lg font-bold text-foreground">Overview</h2>
            <p className="mt-2 max-w-3xl leading-relaxed text-foreground/80">
              {movie.overview || 'No overview is available for this movie yet.'}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {movie.trailerId ? (
                <button
                  type="button"
                  onClick={() => setTrailerOpen(true)}
                  className="glow-primary inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105"
                >
                  <Play className="size-4 fill-current" />
                  Watch Trailer
                </button>
              ) : (
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${movie.title} ${movie.year ?? ''} trailer`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
                >
                  <ExternalLink className="size-4" />
                  Search trailer on YouTube
                </a>
              )}
              <FavoriteButton movie={movie} variant="pill" />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <section className="mb-14">
          <dl className="grid grid-cols-2 gap-6 rounded-3xl border border-border bg-surface/60 p-6 md:grid-cols-4">
            <Fact label="Director">{movie.director}</Fact>
            <Fact label="Release date">{formatDate(movie.releaseDate)}</Fact>
            <Fact label="Status">{movie.status}</Fact>
            <Fact label="Language">{movie.language}</Fact>
            <Fact label="Studios">{movie.companies.slice(0, 3).join(', ')}</Fact>
          </dl>
        </section>

        {movie.cast.length > 0 ? (
          <section className="mb-14">
            <SectionHeading title="Top Cast" />
            <ul className="no-scrollbar -mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
              {movie.cast.map((person) => (
                <li key={person.id} className="w-28 shrink-0 text-center">
                  {person.photo ? (
                    <img src={person.photo} alt={person.name} loading="lazy" className="aspect-[2/3] w-full rounded-xl object-cover" />
                  ) : (
                    <div className="aspect-[2/3] w-full rounded-xl bg-muted" />
                  )}
                  <p className="mt-2 text-sm font-semibold text-foreground">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {movie.similar.length > 0 ? (
          <section className="mb-4">
            <SectionHeading title="You might also like" />
            <MovieCarousel movies={movie.similar} />
          </section>
        ) : null}
      </div>

      <TrailerModal
        open={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        title={movie.title}
        trailerId={movie.trailerId}
      />
    </>
  );
}
