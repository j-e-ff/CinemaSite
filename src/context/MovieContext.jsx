import { createContext, useState, useContext, useEffect } from "react";
import { db } from "../services/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useAuth } from "./AuthContext";

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [watchLater, setWatchLater] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Sync lists with Firestore when user logs in
  useEffect(() => {
    // user is not logged in, clear lists
    if (!user) {
      setFavorites([]);
      setWatchLater([]);
      setIsLoaded(false);
      return;
    }
    // user is logged in - load lists from Firestore
    const fetchData = async () => {
      try {
        console.log("Fetching user data for:", user.uid);
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          console.log("Found user data:", data);
          setFavorites(data.favorites || []);
          setWatchLater(data.watchLater || []);
        } else {
          console.log(
            "No existing user document found, starting with empty lists"
          );
          setFavorites([]);
          setWatchLater([]);
        }
        setIsLoaded(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsLoaded(true);
      }
    };
    fetchData();
  }, [user]);

  // Save lists to Firestore whenever they change
  useEffect(() => {
    if (!user || !isLoaded) {
      console.log("Skipping save - user:", !!user, "isLoaded:", isLoaded);
      return; // only save if user logged in
    }
    const saveData = async () => {
      try {
        console.log("Saving to Firestore:", { favorites, watchLater });
        await setDoc(
          doc(db, "users", user.uid),
          { favorites, watchLater },
          { merge: true }
        );
        console.log("Successfully saved to Firestore");
      } catch (error) {
        console.error("Error saving user data:", error);
      }
    };
    saveData();
  }, [favorites, watchLater, user, isLoaded]);

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
