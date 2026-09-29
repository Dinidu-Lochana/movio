# Movio — Movie Explorer

A responsive movie discovery app built with React. It fetches live data from
[The Movie Database (TMDb) API](https://developers.themoviedb.org/3) so users can search for movies,
browse trending films, filter by genre/year/rating, watch trailers and keep a list of favorites.

**Live demo:** _add your Vercel/Netlify link here after deploying_

## Features

| Requirement | Where |
| --- | --- |
| Login screen (username + password) | `src/pages/Login.js` |
| Search bar with live suggestions | `src/components/SearchBar.js` |
| Poster grid with title, year and rating | `src/components/MovieCard.js`, `MovieGrid.js` |
| Movie details: overview, genres, cast, director, trailer, similar movies | `src/pages/MovieDetails.js` |
| Trending section (home page + `/trending`) | `src/pages/Home.js`, `Trending.js` |
| Light / dark mode (persisted) | `src/lib/movio-store.js`, `src/App.js` |
| Infinite scrolling for search results | `src/pages/Search.js` + `InfiniteSentinel.js` |
| Friendly API error messages with retry | `getErrorMessage` in `src/api/tmdb.js`, `ErrorMessage.js` |
| Global state with Context API | `src/lib/movio-store.js` |
| Last searched movie saved in localStorage | `lastSearch` in the store; shown as "Continue Exploring" on Home |
| Favorites saved locally | `favorites` in the store, `src/pages/Favorites.js` |
| **Bonus:** filter by genre, year, rating (+ sort) | `src/pages/Discover.js`, `Filters.js` |
| **Bonus:** YouTube trailers via embed | `TrailerModal.js` (key comes from TMDb's `videos`) |
| **Bonus:** "Load More" button | `PaginatedGrid.js` (Home, Discover, Trending) |

### Notes

- **Login is a demo.** There is no backend, so the form validates format only (username ≥ 3 chars,
  password ≥ 6 chars) and remembers the username in localStorage. Browsing does not require signing in.
- Search uses **infinite scroll**; Home, Discover and Trending use **Load More**. Both are driven by the
  same `usePaginated` hook.
- Discover filters live in the URL (`/discover?genre=28&year=2024&rating=7`), so views can be shared.
- Styling uses **Tailwind CSS** for layout and the design system, and **Material-UI** for form controls,
  alerts and spinners (its theme follows the light/dark switch).

## Getting started

Requirements: Node.js 18+ and a free TMDb API key
([create one here](https://www.themoviedb.org/settings/api) — use the **API Key (v3 auth)**).

```bash
npm install
cp .env.example .env      # then paste your key into .env
npm run dev               # or: npm start  →  http://localhost:3000
```

`.env`:

```
REACT_APP_TMDB_API_KEY=your_tmdb_v3_api_key_here
```

Restart the dev server after changing `.env`. `.env` is git-ignored. Note that Create React App embeds
`REACT_APP_*` variables in the browser bundle, so a TMDb v3 key is visible to anyone using the deployed
site — this is normal for TMDb's read-only keys, but don't reuse it for anything sensitive.

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` / `npm start` | Start the dev server |
| `npm test` | Run unit tests |
| `npm run build` | Production build in `build/` |

## API usage

All requests go through one axios instance in `src/api/tmdb.js` (base URL, API key, language, 15 s timeout).
Raw payloads are converted to UI-friendly objects by the pure functions in `src/api/normalize.js`.

| Purpose | Endpoint |
| --- | --- |
| Trending (weekly) | `GET /trending/movie/week` |
| Popular / upcoming | `GET /movie/popular`, `GET /movie/upcoming` |
| Search | `GET /search/movie?query=` |
| Filtered browsing | `GET /discover/movie` (`with_genres`, `primary_release_year`, `vote_average.gte`, `sort_by`) |
| Details + cast + trailers + recommendations | `GET /movie/{id}?append_to_response=credits,videos,recommendations` |
| Genre list | `GET /genre/movie/list` |

Errors (missing/invalid key, 404, rate limit, server error, timeout, offline) are mapped to readable
messages; list screens show them with a **Retry** button.

## Project structure

```
src/
├── api/          axios client + response normalisation (+ unit tests)
├── components/   Navbar, SearchBar, MovieCard, MovieGrid, PaginatedGrid, Filters, TrailerModal, ...
├── lib/          Context store, usePaginated, useGenres
├── pages/        Home, Discover, Trending, Search, MovieDetails, Favorites, Login, NotFound
└── App.js        Router + MUI theme + providers
```

## Deployment

The app is a static build with client-side routing; rewrite rules are included for both hosts
(`vercel.json`, `public/_redirects`).

- **Vercel:** import the repo, framework preset *Create React App*, add the env var
  `REACT_APP_TMDB_API_KEY`, deploy.
- **Netlify:** build command `npm run build`, publish directory `build`, add the same env var.

This product uses the TMDb API but is not endorsed or certified by TMDb.
