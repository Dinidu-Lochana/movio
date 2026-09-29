import { cn } from '../lib/cn';

/**
 * Movio logo. The artwork is white on transparent, so `.logo-img` (index.css)
 * inverts it to black in the light theme.
 */
export function Logo({ className }) {
  return (
    <img
      src={`${process.env.PUBLIC_URL}/logo-mark.png`}
      alt="Movio"
      width={512}
      height={408}
      className={cn('logo-img h-9 w-auto object-contain', className)}
    />
  );
}
