
const BASE_URL = "https://api.themoviedb.org/3";

async function tmdbRequest(endpoint) {
  const token = import.meta.env.VITE_TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error(
      "TMDB token is missing. Check frontend/.env.local."
    );
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(
      `TMDB request failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export async function getTrendingMovies() {
  const data = await tmdbRequest("/trending/movie/week");
  return data.results ?? [];
}

export async function getPopularMovies() {
  const data = await tmdbRequest("/movie/popular");
  return data.results ?? [];
}

export async function getActionMovies() {
  const data = await tmdbRequest(
    "/discover/movie?with_genres=28&sort_by=popularity.desc"
  );

  return data.results ?? [];
}

export function getPosterUrl(path, size = "w500") {
  return path
    ? `https://image.tmdb.org/t/p/${size}${path}`
    : null;
}

