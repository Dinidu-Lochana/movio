import { Star } from 'lucide-react';

export function Rating({ value }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/90">
      <Star className="size-3.5 fill-gold text-gold" />
      {value.toFixed(1)}
    </span>
  );
}
