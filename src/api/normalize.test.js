import { normalizeMovie, normalizePage, normalizeDetails, pickTrailer, imageUrl } from './normalize';

describe('normalize helpers', () => {
  test('imageUrl builds a TMDb url and handles missing paths', () => {
    expect(imageUrl('/a.jpg', 'w185')).toBe('https://image.tmdb.org/t/p/w185/a.jpg');
    expect(imageUrl(null)).toBeNull();
  });

  test('normalizeMovie maps fields and derives the year', () => {
    const movie = normalizeMovie({
      id: 1,
      title: 'Test',
      release_date: '2024-05-01',
      vote_average: 7.5,
      poster_path: '/p.jpg',
      genre_ids: [1, 2],
    });
    expect(movie).toMatchObject({ id: 1, title: 'Test', year: 2024, rating: 7.5, genreIds: [1, 2] });
    expect(movie.poster).toContain('/w500/p.jpg');
  });

  test('normalizeMovie tolerates missing data', () => {
    expect(normalizeMovie({ id: 2 })).toMatchObject({ title: 'Untitled', year: null, poster: null });
  });

  test('normalizePage caps totalPages at 500', () => {
    expect(normalizePage({ results: [], page: 1, total_pages: 9000 }).totalPages).toBe(500);
  });

  test('pickTrailer prefers official YouTube trailers', () => {
    const videos = [
      { site: 'Vimeo', type: 'Trailer', key: 'v' },
      { site: 'YouTube', type: 'Teaser', key: 't' },
      { site: 'YouTube', type: 'Trailer', official: true, key: 'official' },
    ];
    expect(pickTrailer(videos).key).toBe('official');
    expect(pickTrailer([])).toBeNull();
  });

  test('normalizeDetails extracts director, cast and trailer', () => {
    const details = normalizeDetails({
      id: 3,
      title: 'Full',
      credits: {
        crew: [{ job: 'Director', name: 'Dir' }],
        cast: [{ id: 9, name: 'Actor', character: 'Hero', profile_path: null }],
      },
      videos: { results: [{ site: 'YouTube', type: 'Trailer', key: 'abc' }] },
    });
    expect(details.director).toBe('Dir');
    expect(details.cast[0]).toMatchObject({ name: 'Actor', character: 'Hero' });
    expect(details.trailerId).toBe('abc');
  });
});
