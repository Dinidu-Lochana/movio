import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useMovio } from '../lib/movio-store';
import { Logo } from '../components/Logo';

const inputClass =
  'w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60';

// Demo-only sign in: there is no backend, so credentials are validated for format
// only and just the username is remembered on this device.
export default function Login() {
  const { signedIn, signIn } = useMovio();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  if (signedIn) return <Navigate to="/" replace />;

  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (username.trim().length < 3) next.username = 'Username must be at least 3 characters.';
    if (password.length < 6) next.password = 'Password must be at least 6 characters.';
    setErrors(next);
    if (Object.keys(next).length) return;
    signIn(username.trim());
    navigate('/');
  };

  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-10">
      <form
        onSubmit={submit}
        noValidate
        className="reveal w-full space-y-5 rounded-3xl border border-border bg-surface/60 p-8"
      >
        <div className="text-center">
          <Logo className="mx-auto h-16" />
          <h1 className="mt-4 text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to your Movio account.</p>
        </div>

        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-foreground">
            Username
          </label>
          <input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="your_username"
            aria-invalid={Boolean(errors.username)}
            className={inputClass}
          />
          {errors.username ? <p className="mt-1.5 text-xs text-primary">{errors.username}</p> : null}
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-foreground">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors.password)}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password ? <p className="mt-1.5 text-xs text-primary">{errors.password}</p> : null}
        </div>

        <button
          type="submit"
          className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
