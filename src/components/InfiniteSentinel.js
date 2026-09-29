import { useEffect, useRef } from 'react';

/** Invisible element that calls `onVisible` when scrolled near the viewport. */
export function InfiniteSentinel({ onVisible, disabled }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || disabled) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onVisible();
      },
      { rootMargin: '400px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [onVisible, disabled]);

  return <div ref={ref} aria-hidden="true" className="h-px" />;
}
