import { useEffect, useState } from 'react';
import { useIsLoading } from '../lib/loading';
import { Logo } from './Logo';

const MIN_SPLASH_MS = 900; // avoid a jarring flash on fast connections
const NO_REQUEST_GRACE_MS = 1500; // pages that make no request on load still get dismissed
const MAX_SPLASH_MS = 8000; // never trap the user behind the splash

/** Animated Movio mark: pulsing logo inside two counter-rotating film rings. */
function LoaderMark({ size = 96 }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <span className="loader-ring absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary/40" />
      <span className="loader-ring-reverse absolute inset-2.5 rounded-full border-2 border-transparent border-b-gold border-l-gold/40" />
      <Logo className="loader-pulse w-auto" />
    </div>
  );
}

/** Full-screen splash shown on first load, fading out once initial data has arrived. */
function Splash({ loading, onDone }) {
  const [minElapsed, setMinElapsed] = useState(false);
  const [graceElapsed, setGraceElapsed] = useState(false);
  const [seenLoading, setSeenLoading] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setMinElapsed(true), MIN_SPLASH_MS),
      setTimeout(() => setGraceElapsed(true), NO_REQUEST_GRACE_MS),
      setTimeout(() => setLeaving(true), MAX_SPLASH_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (loading) setSeenLoading(true);
  }, [loading]);

  useEffect(() => {
    if (minElapsed && !loading && (seenLoading || graceElapsed)) setLeaving(true);
  }, [minElapsed, loading, seenLoading, graceElapsed]);

  useEffect(() => {
    if (!leaving) return undefined;
    const t = setTimeout(onDone, 500); // matches the fade-out duration
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  return (
    <div
      role="status"
      aria-label="Loading Movio"
      className={`fixed inset-0 z-[300] grid place-items-center bg-background transition-opacity duration-500 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <LoaderMark />
        <div className="text-center">
          <p className="mt-1 flex items-center justify-center gap-1 text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Loading
            {[0, 1, 2].map((i) => (
              <span key={i} className="loader-dot size-1 rounded-full bg-primary" style={{ animationDelay: `${i * 160}ms` }} />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Global loading feedback:
 *  1. a splash screen on first load,
 *  2. a slim progress bar at the top while any API request runs,
 *  3. a small floating "Loading" pill in the corner for longer requests.
 */
export function GlobalLoader() {
  const loading = useIsLoading();
  const [splash, setSplash] = useState(true);
  const [barVisible, setBarVisible] = useState(false);
  const [pillVisible, setPillVisible] = useState(false);

  // Small delay before showing (no flicker on instant responses) and a short linger before hiding.
  useEffect(() => {
    const timer = setTimeout(() => setBarVisible(loading), loading ? 120 : 250);
    return () => clearTimeout(timer);
  }, [loading]);

  // The pill only appears if loading drags on.
  useEffect(() => {
    const timer = setTimeout(() => setPillVisible(loading), loading ? 700 : 200);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <>
      {splash ? <Splash loading={loading} onDone={() => setSplash(false)} /> : null}

      {barVisible ? (
        <div
          role="progressbar"
          aria-label="Loading"
          className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[3px] overflow-hidden bg-primary/20"
        >
          <div className="loader-bar h-full w-2/5 rounded-full bg-primary shadow-[0_0_12px_oklch(var(--primary))]" />
        </div>
      ) : null}

      {!splash && pillVisible ? (
        <div
          role="status"
          className="fade-in pointer-events-none fixed bottom-6 right-6 z-[150] flex items-center gap-3 rounded-full border border-border bg-surface/90 py-2 pl-2 pr-4 shadow-lift backdrop-blur"
        >
          <LoaderMark size={28} />
          <span className="text-xs font-semibold text-foreground">Loading…</span>
        </div>
      ) : null}
    </>
  );
}
