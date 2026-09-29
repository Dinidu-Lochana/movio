import { useMemo } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MovioProvider, useMovio } from './lib/movio-store';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { GlobalLoader } from './components/GlobalLoader';
import Home from './pages/Home';
import Discover from './pages/Discover';
import Trending from './pages/Trending';
import Search from './pages/Search';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

/** Keeps MUI components (selects, alerts, spinners) in sync with the app's light/dark mode. */
function MuiTheme({ children }) {
  const { theme: mode } = useMovio();
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: '#ef4136' },
          background: {
            default: mode === 'dark' ? '#17171c' : '#ffffff',
            paper: mode === 'dark' ? '#1e1e24' : '#f7f7f8',
          },
        },
        shape: { borderRadius: 12 },
        typography: { fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif' },
      }),
    [mode]
  );
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

function App() {
  return (
    <MovioProvider>
      <MuiTheme>
        <BrowserRouter>
          <GlobalLoader />
          <ScrollToTop />
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/search" element={<Search />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </MuiTheme>
    </MovioProvider>
  );
}

export default App;
