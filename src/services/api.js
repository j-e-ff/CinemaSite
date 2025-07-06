const API_KEY = "d8adda5f151d7d774e14559dafc26eca";
const BASE_URL = "https://api.themoviedb.org/3";

// Movies
export const getPopularMovies = async () => {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
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
  const response = await fetch(`${BASE_URL}/movie/${movie_id}?api_key=${API_KEY}`);
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

export const getMovieImages = async (movie_id) =>{
  const response = await fetch(`${BASE_URL}/movie/${movie_id}/images?api_key=${API_KEY}`)
  const data = await response.json();
  return data;
}

export const getMovieProviders = async(movie_id)=>{
  const response = await fetch(`${BASE_URL}/movie/${movie_id}/watch/providers?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results; //object will be keyed by country codes
}

// Series
export const getPopularShows = async () => {
  const response = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}`);
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
  const response = await fetch(`${BASE_URL}/tv/${series_id}?api_key=${API_KEY}`);
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

export const getSeriesImages = async(series_id) =>{
  const response = await fetch(`${BASE_URL}/tv/${series_id}/images?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

export const getShowProviders = async(series_id)=>{
  const response = await fetch(`${BASE_URL}/tv/${series_id}/watch/providers?api_key=${API_KEY}`);
  const data = await response.json();
  return data.results;  //object will be keyed by country codes
}

//people
export const getPeople = async (person_id) => {
  const response = await fetch(`${BASE_URL}/person/${person_id}?api_key=${API_KEY}`);
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

