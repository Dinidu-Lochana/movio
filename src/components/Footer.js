import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';

// Placeholder profile URLs - swap in the real accounts.
const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com', Icon: InstagramIcon },
  { label: 'X', href: 'https://x.com', Icon: XIcon },
  { label: 'YouTube', href: 'https://youtube.com', Icon: YouTubeIcon },
];

const linkClass = 'block text-muted-foreground hover:text-foreground';
const headClass = 'text-xs font-semibold uppercase tracking-widest text-foreground';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <Logo className="h-10" />
            <span className="text-lg font-bold text-foreground">Movio</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Discover. Explore. Experience.</p>
          <ul className="mt-5 flex gap-2">
            {SOCIALS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <Icon sx={{ fontSize: 18 }} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-6 text-sm md:col-span-2">
          <div className="space-y-2">
            <p className={headClass}>Explore</p>
            <Link to="/" className={linkClass}>Home</Link>
            <Link to="/discover" className={linkClass}>Discover</Link>
            <Link to="/trending" className={linkClass}>Trending</Link>
            <Link to="/favorites" className={linkClass}>Favorites</Link>
          </div>
          <div className="space-y-2">
            <p className={headClass}>Account</p>
            <Link to="/login" className={linkClass}>Sign In</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {new Date().getFullYear()} Movio. All rights reserved.
      </div>
    </footer>
  );
}
