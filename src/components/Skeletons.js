import { MovieCardSkeleton } from './MovieCard';

const bar = 'rounded-full bg-muted';

/** Placeholder for the home hero while trending movies load. */
export function HeroSkeleton() {
  return (
    <section className="relative min-h-[88vh] animate-pulse overflow-hidden bg-surface/40">
      <div className="hero-fade absolute inset-0" />
      <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-24 sm:px-6">
        <div className="max-w-2xl space-y-4">
          <div className={`h-3 w-40 ${bar}`} />
          <div className={`h-14 w-4/5 rounded-2xl bg-muted`} />
          <div className={`h-4 w-64 ${bar}`} />
          <div className="space-y-2">
            <div className={`h-3 w-full ${bar}`} />
            <div className={`h-3 w-11/12 ${bar}`} />
            <div className={`h-3 w-2/3 ${bar}`} />
          </div>
          <div className="flex gap-3 pt-4">
            <div className="h-12 w-40 rounded-full bg-muted" />
            <div className="h-12 w-36 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Horizontal row of poster skeletons (carousels). */
export function CarouselSkeleton({ count = 6 }) {
  return (
    <div className="no-scrollbar -mx-1 flex gap-4 overflow-hidden px-1 pb-2">
      {Array.from({ length: count }, (_, i) => (
        <MovieCardSkeleton key={i} className="w-[44vw] shrink-0 sm:w-56 lg:w-60" />
      ))}
    </div>
  );
}

/** Genre chip placeholders. */
export function ChipsSkeleton({ count = 12 }) {
  return (
    <div className="flex animate-pulse flex-wrap gap-2.5">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="h-10 rounded-full bg-muted" style={{ width: `${5 + ((i * 7) % 5)}rem` }} />
      ))}
    </div>
  );
}

/** Placeholder for the movie details page. */
export function DetailsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-12 pt-16 sm:px-6 md:grid-cols-[280px_1fr] md:pt-24">
        <div className="mx-auto aspect-[2/3] w-56 rounded-2xl bg-muted md:w-full" />
        <div className="space-y-4 self-end">
          <div className="h-12 w-3/4 rounded-2xl bg-muted" />
          <div className={`h-4 w-1/3 ${bar}`} />
          <div className={`h-4 w-64 ${bar}`} />
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-full bg-muted" />
            <div className="h-7 w-24 rounded-full bg-muted" />
            <div className="h-7 w-16 rounded-full bg-muted" />
          </div>
          <div className="space-y-2 pt-4">
            <div className={`h-3 w-full ${bar}`} />
            <div className={`h-3 w-full ${bar}`} />
            <div className={`h-3 w-4/5 ${bar}`} />
          </div>
          <div className="h-12 w-44 rounded-full bg-muted" />
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-14 h-28 rounded-3xl bg-muted/60" />
        <div className={`mb-6 h-7 w-40 ${bar}`} />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className="w-28 shrink-0 space-y-2">
              <div className="aspect-[2/3] w-full rounded-xl bg-muted" />
              <div className={`h-3 w-3/4 ${bar}`} />
              <div className={`h-3 w-1/2 ${bar}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
