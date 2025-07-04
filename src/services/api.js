const API_KEY = "d8adda5f151d7d774e14559dafc26eca";
const BASE_URL = "https://api.themoviedb.org/3";

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

export const getMovieDetails = async (id) => {
  const response = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
};

export const getMovieCredits = async(id) =>{
  const response = await fetch(`${BASE_URL}/movie/${id}/credits?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

export const getMovieRatings = async(id) =>{
  const response = await fetch(`${BASE_URL}/movie/${id}/account_states?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

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

export const getShowDetails = async (id)=>{
  const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

export const getShowCredits = async(id)=>{
  const response = await fetch(`${BASE_URL}/tv/${id}/credits?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

//people 
export const getPeople = async(id)=>{
  const response = await fetch(`${BASE_URL}/person/${id}?api_key=${API_KEY}`);
  const data = await response.json();
  return data;
}

export const getExternalIDs = async(id) =>{
  const response = await fetch(`${BASE_URL}/person/${id}/external_ids?api_key=${API_KEY}`);
  const data = await response.json();
  return data
}
