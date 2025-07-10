import DisplayMovies from "../components/DisplayMovies";
import { useState, useEffect } from "react";
import {
  getPopularMovies,
  getNowPlaying,
  getTopRated,
  getUpcoming,
  searchMovies,
  getPopularShows,
  getAiringToday,
  getOnTheAir,
  getTopRatedShows,
  searchShows,
} from "../services/api";
import "../css/Home.css";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // getting movies
  const [movies, setMovies] = useState([]); // POPULAR MOVIES
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  //getting shows
  const [shows, setShows] = useState([]); // POPULAR SHOWS
  const [airingToday, setAiringToday] = useState([]);
  const [onTheAir, setOnTheAir] = useState([]);
  const [topRatedShows, setTopRatedShows] = useState([]);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [movieToggle, setMovieToggle] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        if (movieToggle) {
          const [popularMovies, nowPlaying, topRated, upcoming] =
            await Promise.all([
              getPopularMovies(),
              getNowPlaying(),
              getTopRated(),
              getUpcoming(),
            ]);
          setMovies(popularMovies);
          setNowPlayingMovies(nowPlaying);
          setTopRatedMovies(topRated);
          setUpcomingMovies(upcoming);
        } else {
          const [popularShows, airing, onAir, topShows] = await Promise.all([
            getPopularShows(),
            getAiringToday(),
            getOnTheAir(),
            getTopRatedShows(),
          ]);
          setShows(popularShows);
          setAiringToday(airing);
          setOnTheAir(onAir);
          setTopRatedShows(topShows);
        }
        setError(null);
      } catch (err) {
        console.log(err);
        setError(
          movieToggle ? "Failed to load movies..." : "Failed to load shows..."
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [movieToggle]); // Add movieToggle as dependency so it reloads when toggled

  const handleSearch = async (e) => {
    e.preventDefault(); //prevents the page from refreshing and deleting the search box text
    if (!searchQuery.trim()) return; //removes trailing spaces between strings
    if (loading) return;
    setLoading(true);
    try {
      if (movieToggle) {
        const movieResults = await searchMovies(searchQuery);
        setSearchResults(movieResults);
      } else {
        const showResults = await searchShows(searchQuery);
        setSearchResults(showResults);
      }
      setSearchMode(true);
      setError(null);
    } catch (err) {
      console.log(err);
      setError(
        movieToggle ? "Failed to search movies" : "Failed to search shows"
      );
    } finally {
      setLoading(false);
    }
  };

  function movieClick(e) {
    e.preventDefault();
    setMovieToggle(true);
    if (searchMode && searchQuery.trim()) {
      handleSearchForType(true);
    }
  }

  function tvClick(e) {
    e.preventDefault();
    setMovieToggle(false);
    if (searchMode && searchQuery.trim()) {
      handleSearchForType(false);
    }
  }

  const clearSearch = () => {
    setSearchMode(false);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
  };

  const handleSearchForType = async (isMovie) => {
    if (loading) return;
    setLoading(true);
    try {
      if (isMovie) {
        const movieResults = await searchMovies(searchQuery);
        setSearchResults(movieResults);
      } else {
        const showResults = await searchShows(searchQuery);
        setSearchResults(showResults);
      }
      setError(null);
    } catch (err) {
      console.log(err);
      setError(isMovie ? "Failed to search movies" : "Failed to search shows");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchQueryChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (!value.trim() && searchMode) {
      clearSearch();
    }
  };

  return (
    <div className="home">
      {/* SEARCH SECTION */}
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          placeholder="Seach for movies..."
          className="search-input"
          value={searchQuery}
          onChange={handleSearchQueryChange}
        ></input>
        <button className="search-button">Search</button>
      </form>
      <div className="type-container">
        <button className="type" onClick={movieClick}>
          Movie
        </button>
        <button className="type" onClick={tvClick}>
          TV
        </button>
      </div>
      {/* ERROR */}
      {error && <div className="error-message">{error}</div>}

      {/* LOADING */}
      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <div className="display-container">
          {searchMode ? (
            <div>
              {" "}
              <h2 className="title">
                Search results for "{searchQuery}" -{" "}
                {movieToggle ? "Movie" : "TV"}
              </h2>
              <button
                onClick={clearSearch}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#666",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Clear Search
              </button>
              <DisplayMovies
                movieToggle={movieToggle}
                movieList={searchResults}
                sectionId="search-results"
                isSearch={true}
              />
            </div>
          ) : (
            <div>
              {/* POPULAR MOVIE SECTION */}
              {movieToggle ? (
                <h2 className="title">Popular Movies</h2>
              ) : (
                <h2>Popular Shows</h2>
              )}
              <DisplayMovies
                movieToggle={movieToggle}
                movieList={movieToggle ? movies : shows}
                sectionId="popular"
              />
              {/* NOW AIRING SECTION */}
              {movieToggle ? <h2>Now Playing</h2> : <h2>Airing Today</h2>}
              <DisplayMovies
                movieToggle={movieToggle}
                movieList={movieToggle ? nowPlayingMovies : airingToday}
                sectionId="now-playing"
              />
              {/* UPCOMING SECTION */}
              {movieToggle ? <h2>Upcoming</h2> : <h2>On The Air</h2>}
              <DisplayMovies
                movieToggle={movieToggle}
                movieList={movieToggle ? upcomingMovies : onTheAir}
                sectionId="upcoming"
              />
              {/* TOP RATED SECTION */}
              <h2>Top Rated</h2>
              <DisplayMovies
                movieToggle={movieToggle}
                movieList={movieToggle ? topRatedMovies : topRatedShows}
                sectionId="top-rated"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
