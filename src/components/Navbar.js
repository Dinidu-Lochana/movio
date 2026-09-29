import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Search, Sun, Moon, User, Menu, X, Heart, LogOut } from 'lucide-react';
import { useMovio } from '../lib/movio-store';
import { SearchBar } from './SearchBar';
import { Logo } from './Logo';

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/trending', label: 'Trending' },
  { to: '/favorites', label: 'Favorites' },
];

const iconBtn =
  'grid size-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground';

export function Navbar() {
  const { theme, toggleTheme, favorites, signedIn, username, signOut } = useMovio();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="glass sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setMenuOpen(false)}>
          <Logo />
          <span className="text-lg font-bold tracking-tight text-foreground">Movio</span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-foreground ${
                  isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={() => setSearchOpen((v) => !v)} aria-label="Search movies" className={iconBtn}>
            {searchOpen ? <X className="size-4" /> : <Search className="size-4" />}
          </button>

          <button type="button" onClick={toggleTheme} aria-label="Toggle theme" className={iconBtn}>
            {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          <Link to="/favorites" aria-label="Favorites" className={`relative hidden sm:grid ${iconBtn}`}>
            <Heart className="size-4" />
            {favorites.length > 0 ? (
              <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-primary" />
            ) : null}
          </Link>

          {signedIn ? (
            <div className="hidden items-center gap-1 rounded-full border border-border py-1 pl-3 pr-1 sm:flex">
              <User className="size-4 text-foreground" />
              <span className="max-w-24 truncate text-sm font-medium text-foreground">{username}</span>
              <button type="button" onClick={signOut} aria-label="Sign out" className={`size-8 ${iconBtn}`}>
                <LogOut className="size-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/60 sm:inline-flex"
            >
              <User className="size-4" />
              Sign In
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menu"
            className={`md:hidden ${iconBtn}`}
          >
            {menuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {searchOpen ? (
        <div className="border-t border-border bg-background/95 px-4 py-4 sm:px-6">
          <SearchBar autoFocus onDone={() => setSearchOpen(false)} />
        </div>
      ) : null}

      {menuOpen ? (
        <nav className="border-t border-border bg-background/95 px-4 py-3 md:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block rounded-xl px-3 py-3 text-sm font-medium ${isActive ? 'text-primary' : 'text-foreground'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          {signedIn ? (
            <button
              type="button"
              onClick={() => {
                signOut();
                setMenuOpen(false);
              }}
              className="block w-full rounded-xl px-3 py-3 text-left text-sm font-medium text-foreground"
            >
              Sign out ({username})
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-3 py-3 text-sm font-medium text-foreground"
            >
              Sign In
            </Link>
          )}
        </nav>
      ) : null}
    </header>
  );
}
