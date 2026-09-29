import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function TrailerModal({ open, onClose, title, trailerId }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // Portal to <body> so the modal escapes any parent stacking context (e.g. the hero's `isolate`).
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} trailer`}
      onClick={onClose}
      className="fade-in fixed inset-0 z-100 grid place-items-center bg-background/90 p-4 backdrop-blur-xl"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="reveal w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-surface shadow-lift"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">Official Trailer</p>
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close trailer"
            className="grid size-10 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-primary/60 hover:text-primary"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="aspect-video w-full bg-background">
          <iframe
            src={`https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0`}
            title={`${title} trailer`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="size-full"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
