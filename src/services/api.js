const API_KEY = "d8adda5f151d7d774e14559dafc26eca";
const BASE_URL = "https://api.themoviedb.org/3";

// MOVIES ENDPOINTS
export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const getNowPlaying = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getTopRated = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getUpcoming = async (movie_id) => {
  const response = await fetch(`${BASE_URL}/movie/upcoming?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchMovies = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieDetails = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getMovieCredits = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/credits?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getMovieRatings = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/account_states?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getMovieRecommendations = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/recommendations?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieImages = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/images?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getMovieProviders = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/watch/providers?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results; //object will be keyed by country codes
};

export const getMovieTrailers = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
};

export const getMovieReviews = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/reviews?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getMovieRated = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/movie/${movie_id}/release_dates?api_key=${API_KEY}`
  );
  const data = await response.json();

  const usRelease = data.results.find((entry) => entry.iso_3166_1 === "US");

  if (!usRelease) return "N/A";

  const rating = usRelease.release_dates.find((r) => r.certification !== "");
  return rating?.certification || "N/A";
};

export const getMovieGenres = async () => {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};
// discover movies by genere
export const discoverMoviesByGenre = async (
  genreIds,
  sortBy = "popularity.desc",
  page = 1
) => {
  const response = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreIds}&sort_by=${sortBy}&page=${page}`
  );
  const data = await response.json();
  return data.results;
};

// SERIES ENDPOINTS
export const getShowGenres = async () => {
  const response = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const discoverShowsByGenre = async (
  genreIds,
  sortBy = "popularity.desc",
  page = 1
) => {
  const response = await fetch(
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&with_genres=${genreIds}&sort_by=${sortBy}&page=${page}`
  );
  const data = await response.json();
  return data.results;
};

export const getPopularShows = async () => {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const getAiringToday = async (movie_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/airing_today?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getOnTheAir = async (movie_id) => {
  const response = await fetch(`${BASE_URL}/tv/on_the_air?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const getTopRatedShows = async () => {
  const response = await fetch(`${BASE_URL}/tv/top_rated?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;
};

export const searchShows = async (query) => {
  const response = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await response.json();
  return data.results;
};

export const getShowDetails = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getShowCredits = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/aggregate_credits?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getShowRecommendations = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/recommendations?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

export const getSeriesImages = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/images?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getShowProviders = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/watch/providers?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results; //object will be keyed by country codes
};

export const getShowTrailers = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/videos?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results.filter(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
};

export const getShowRated = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/content_ratings?api_key=${API_KEY}`
  );
  const data = await response.json();

  const usRating = data.results.find((entry) => entry.iso_3166_1 === "US");
  return usRating?.rating || "Not Rated";
};

export const getShowReviews = async (series_id) => {
  const response = await fetch(
    `${BASE_URL}/tv/${series_id}/reviews?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data.results;
};

// PEOPLE ENDPOINTS
export const getPeople = async (person_id) => {
  const response = await fetch(
    `${BASE_URL}/person/${person_id}?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getExternalIDs = async (person_id) => {
  const response = await fetch(
    `${BASE_URL}/person/${person_id}/external_ids?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};

export const getCombinedCredits = async (person_id) => {
  const response = await fetch(
    `${BASE_URL}/person/${person_id}/combined_credits?api_key=${API_KEY}`
  );
  const data = await response.json();
  return data;
};
