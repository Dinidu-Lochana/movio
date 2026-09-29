import { Link } from 'react-router-dom';

export function EmptyState({ icon, title, description, ctaLabel, ctaTo = '/' }) {
  return (
    <div className="reveal mx-auto max-w-md rounded-3xl border border-border bg-surface/60 px-8 py-14 text-center">
      {icon ? (
        <div className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-xl font-bold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {ctaLabel ? (
        <Link
          to={ctaTo}
          className="mt-6 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-105"
        >
          {ctaLabel}
        </Link>
      ) : null}
    </div>
  );
}
