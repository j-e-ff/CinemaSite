import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";
import { useState, useEffect } from "react";
import {
  getPopularMovies,
  searchMovies,
  getPopularShows,
  searchShows,
} from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieToggle, setMovieToggle] = useState(true);

  useEffect(() => {
    const loadPopular = async () => {
      if (movieToggle) {
        try {
          const popularMovies = await getPopularMovies();
          setMovies(popularMovies);
        } catch (err) {
          console.log(err);
          setError("Failed to load movies...");
        } finally {
          setLoading(false);
        }
      }
      try {
        const popularShows = await getPopularShows();
        setShows(popularShows);
      } catch {
        console.log(err);
        setError("Failed to load shows...");
      } finally {
        setLoading(false);
      }
    };
    loadPopular();
  }, []); //if anything inside the dependency array changes, the effect will run again, if nothing inside it will run just 1 time

  const handleSearch = async (e) => {
    e.preventDefault(); //prevents the page from refreshing and deleting the search box text
    if (!searchQuery.trim()) return; //removes trailing spaces between strings
    if (loading) return;
    setLoading(true);
    if (movieToggle) {
      try {
        const searchResults = await searchMovies(searchQuery);
        setMovies(searchResults);
        setError(null);
      } catch {
        console.log(err);
        setError("Failed to search movie");
      } finally {
        setLoading(false);
      }
    }
    try {
      const searchResults = await searchShows(searchQuery);
      setShows(searchResults);
      setError(null);
    } catch {
      console.log(err);
      setError("Failed to search movie");
    } finally {
      setLoading(false);
    }
  };

  function movieClick(e) {
    setMovieToggle(true);
    handleSearch(e);
  }

  function tvClick(e) {
    setMovieToggle(false);
    handleSearch(e);
  }

  return (
    <div className="home">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Seach for movies..."
          className="search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        ></input>
        <button className="search-button">
          Search
        </button>
      </form>
      <div className="type-container">
        <button className="type" onClick={movieClick}>
          Movie
        </button>
        <button className="type" onClick={tvClick}>
          TV
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="movies-grid">
          {(movieToggle ? movies : shows).map((item) =>
            movieToggle ? (
              <MovieCard movie={item} key={item.id} />
            ) : (
              <ShowCard movie={item} key={item.id} />
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
