import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on app start
  useEffect(() => {
    try {
      const storedFavs = localStorage.getItem("favorites");
      console.log("Loading from localStorage:", storedFavs);
      if (storedFavs) {
        const parsedFavs = JSON.parse(storedFavs);
        console.log("Parsed favorites:", parsedFavs);
        if (Array.isArray(parsedFavs)) {
          setFavorites(parsedFavs);
          console.log("Set favorites from localStorage:", parsedFavs);
        }
      }
      setIsLoaded(true);
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
      setIsLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (isLoaded) { // Only save after initial load to prevent overwriting
      try {
        console.log("Saving to localStorage:", favorites);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        console.log("Successfully saved to localStorage");
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites, isLoaded]);

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

  

  //making these accessible to the children wrapped inside the provider, we have to provide a value inside the provider
  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  };

  return (
    <MovieContext.Provider value={value}>{children}</MovieContext.Provider>
  );
};
