import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on app start
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("favorites");
      const storedWatchLater = localStorage.getItem("watch-later");
      console.log("Loading from localStorage:", storedFavs);
      console.log("Loading from localStorage:", storedWatchLater);
      if (storedFavs) {
        const parsedFavs = JSON.parse(storedFavs);
        console.log("Parsed favorites:", parsedFavs);
        if (Array.isArray(parsedFavs)) {
          setFavorites(parsedFavs);
          console.log("Set favorites from localStorage:", parsedFavs);
        }
      }
      if (storedWatchLater) {
        const parsedWatchLater = JSON.parse(storedWatchLater);
        console.log("Parsed watch later:", parsedWatchLater);
        if (Array.isArray(parsedWatchLater)) {
          setWatchLater(parsedWatchLater);
          console.log("Set watch later from localStorage:", parsedWatchLater);
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error(
        "Error loading favorites or watch later from localStorage:",
        error
      );
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) {
      // Only save after initial load to prevent overwriting
      try {
        console.log("Saving to localStorage:", favorites);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Successfully saved to localStorage");
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites, isLoaded]);

  //saving watch later list to localStorage
  useEffect(() => {
    if (isLoaded) {
      // Only save after initial load to prevent overwriting
      try {
        console.log("Saving to localStorage:", watchLater);
        localStorage.setItem("watch-later", JSON.stringify(watchLater));
        console.log("Successfully saved to localStorage");
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [watchLater, isLoaded]);

  //operations for list
  const addToFavorites = (movie) => {
    console.log("Adding to favorites:", movie);
    setFavorites((prev) => [...prev, movie]); //taking the previous values (all favorites) and adding the new movie to let react know a state has changed
  };

  const removeFromFavorites = (movieId) => {
    console.log("Removing from favorites:", movieId);
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId)); //generating a new array with only the movies not equal to the one being removed
  };

  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const addToWatchLater = (movie) => {
    console.log("Adding to watch later:", movie);
    setWatchLater((prev) => [...prev, movie]);
  };

  const removeFromWatchLater = (movieId) => {
    console.log("Removing from watch later:", movieId);
    setWatchLater((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const isWatchLater = (movieId) => {
    return watchLater.some((movie) => movie.id === movieId);
  };

  //making these accessible to the children wrapped inside the provider, we have to provide a value inside the provider
  const value = {
    favorites,
    watchLater,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    addToWatchLater,
    removeFromWatchLater,
    isWatchLater,
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
