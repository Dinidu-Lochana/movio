import axios from 'axios';
import { normalizeDetails, normalizePage } from './normalize';
import { requestFinished, requestStarted } from '../lib/loading';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;

// One axios instance: the API key and language are attached to every request.
const client = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: API_KEY, language: 'en-US' },
  timeout: 15000,
});

client.interceptors.request.use((config) => {
  if (!API_KEY) {
    return Promise.reject(
      Object.assign(new Error('missing-key'), { code: 'MISSING_KEY' })
    );
  }
  return config;
});

// Registered after the key check, so it runs first: every request that reaches the
// response interceptor below (success or failure) is counted exactly once.
client.interceptors.request.use((config) => {
  requestStarted();
  return config;
});
client.interceptors.response.use(
  (response) => {
    requestFinished();
    return response;
  },
  (error) => {
    requestFinished();
    return Promise.reject(error);
  }
);

/** Turns any thrown error into a message that is safe to show to users. */
export function getErrorMessage(err) {
  if (err?.code === 'MISSING_KEY') {
    return 'The TMDb API key is missing. Add REACT_APP_TMDB_API_KEY to your .env file and restart the app.';
  }
  const status = err?.response?.status;
  if (status === 401) return 'TMDb rejected the API key. Please check REACT_APP_TMDB_API_KEY.';
  if (status === 404) return 'We could not find what you were looking for.';
  if (status === 429) return 'Too many requests right now. Please wait a moment and try again.';
  if (status >= 500) return 'TMDb is having trouble right now. Please try again shortly.';
  if (err?.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!err?.response) return 'Network error. Check your connection and try again.';
  return err.response.data?.status_message || 'Something went wrong. Please try again.';
}

const list = async (url, params) => normalizePage((await client.get(url, { params })).data);

export const fetchTrending = (page = 1) => list('/trending/movie/week', { page });
export const fetchPopular = (page = 1) => list('/movie/popular', { page });
export const fetchUpcoming = (page = 1) => list('/movie/upcoming', { page });

export const searchMovies = (query, page = 1) =>
  list('/search/movie', { query, page, include_adult: false });

/** Filtered browsing: genre id, release year, minimum rating and sort order. */
export function discoverMovies({ genre, year, minRating, sort = 'popularity.desc' } = {}, page = 1) {
  const params = { page, sort_by: sort, include_adult: false };
  if (genre && genre !== 'all') params.with_genres = genre;
  if (year && year !== 'all') params.primary_release_year = year;
  if (minRating && Number(minRating) > 0) params['vote_average.gte'] = minRating;
  // Rating sort is meaningless without a vote floor (a 10.0 from 1 vote).
  if (sort.startsWith('vote_average')) params['vote_count.gte'] = 200;
  if (sort.startsWith('primary_release_date')) {
    params['primary_release_date.lte'] = new Date().toISOString().slice(0, 10);
  }
  return list('/discover/movie', params);
}

export async function fetchMovie(id) {
  const { data } = await client.get(`/movie/${id}`, {
    params: { append_to_response: 'credits,videos,recommendations' },
  });
  return normalizeDetails(data);
}

export async function fetchGenres() {
  const { data } = await client.get('/genre/movie/list');
  return data.genres || [];
}
