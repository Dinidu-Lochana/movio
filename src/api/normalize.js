// Pure helpers that convert raw TMDb payloads into the shapes the UI uses.
// Kept free of axios so they can be unit-tested easily.

const IMAGE_BASE = 'https://image.tmdb.org/t/p';

export function imageUrl(path, size = 'w500') {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

/** Normalises a movie from any list endpoint (trending, search, discover...). */
export function normalizeMovie(m) {
  const releaseDate = m.release_date || '';
  return {
    id: m.id,
    title: m.title || m.name || 'Untitled',
    year: releaseDate ? Number(releaseDate.slice(0, 4)) : null,
    releaseDate,
    rating: m.vote_average || 0,
    votes: m.vote_count || 0,
    overview: m.overview || '',
    poster: imageUrl(m.poster_path, 'w500'),
    backdrop: imageUrl(m.backdrop_path, 'w1280'),
    genreIds: m.genre_ids || (m.genres || []).map((g) => g.id),
  };
}

/** Normalises a paginated list response. TMDb caps pagination at 500 pages. */
export function normalizePage(data) {
  return {
    results: (data.results || []).map(normalizeMovie),
    page: data.page,
    totalPages: Math.min(data.total_pages || 1, 500),
  };
}

/** Picks the best YouTube video: official trailer > trailer > teaser > anything. */
export function pickTrailer(videos = []) {
  const yt = videos.filter((v) => v.site === 'YouTube');
  return (
    yt.find((v) => v.type === 'Trailer' && v.official) ||
    yt.find((v) => v.type === 'Trailer') ||
    yt.find((v) => v.type === 'Teaser') ||
    yt[0] ||
    null
  );
}

/** Normalises /movie/{id}?append_to_response=credits,videos,recommendations */
export function normalizeDetails(d) {
  const crew = d.credits?.crew || [];
  const cast = d.credits?.cast || [];
  const trailer = pickTrailer(d.videos?.results);

  return {
    ...normalizeMovie(d),
    tagline: d.tagline || '',
    runtime: d.runtime || 0,
    status: d.status || '',
    language: d.spoken_languages?.[0]?.english_name || d.original_language || '',
    genres: d.genres || [],
    companies: (d.production_companies || []).map((c) => c.name),
    director: crew.find((c) => c.job === 'Director')?.name || '',
    cast: cast.slice(0, 12).map((c) => ({
      id: c.id,
      name: c.name,
      character: c.character,
      photo: imageUrl(c.profile_path, 'w185'),
    })),
    trailerId: trailer?.key || null,
    similar: (d.recommendations?.results || []).slice(0, 12).map(normalizeMovie),
  };
}

export function formatRuntime(minutes) {
  if (!minutes) return '';
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
