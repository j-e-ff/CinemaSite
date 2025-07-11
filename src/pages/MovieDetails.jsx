import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieRecommendations,
  getMovieTrailers,
} from "../services/api";
import "../css/MovieDetails.css";
import WhereToWatch from "../components/WhereToWatch";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";
import noProfilePicture from "../assets/no-profile-picture.jpg";

function MovieDetails() {
  const { id } = useParams(); //getting the movie id
  const [movie, setMovie] = useState(null);
  const [credit, setCredits] = useState(null);
  const [recommendedMovies, setRecommendedMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailers, setTrailers] = useState(null);

  // scrolling
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  //favorite button
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isWatchLater,
    addToWatchLater,
    removeFromWatchLater,
  } = useMovieContext();

  function onFavoriteClick(e) {
    e.preventDefault();
    if (movie && isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else if (movie) {
      addToFavorites(movie);
    }
  }

  // adding movie to watch later list
  function onWatchLaterClick(e) {
    e.preventDefault();
    if (movie && isWatchLater(movie.id)) {
      removeFromWatchLater(movie.id);
    } else if (movie) {
      addToWatchLater(movie);
    }
  }

  const checkScrollPosition = () => {
    const cast = document.querySelector(".cast-list");
    if (cast) {
      const { scrollLeft, scrollWidth, clientWidth } = cast;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.addEventListener("scroll", checkScrollPosition);
      return () => cast.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  const scrollToNext = () => {
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.scrollBy({
        left: 800,
        behavior: "smooth",
      });
      // Wait for smooth scroll to finish
      setTimeout(checkScrollPosition, 350); 
    }
  };

  const scrollToPrev = () => {
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.scrollBy({
        left: -800,
        behavior: "smooth",
      });
      // Wait for smooth scroll to finish
      setTimeout(checkScrollPosition, 350); 
    }
  };

  useEffect(() => {
    async function loadMovie() {
      try {
        const movieData = await getMovieDetails(id);
        const movieCredits = await getMovieCredits(id);
        const recommendations = await getMovieRecommendations(id);
        const movieTrailers = await getMovieTrailers(id);
        setTrailers(movieTrailers);
        setRecommendedMovies(recommendations);
        setMovie(movieData);
        setCredits(movieCredits);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadMovie();
  }, [id]);

  if (loading) return <div>Loading movie details...</div>;
  if (!movie) return <div>Error, movie not found</div>;

  return (
    <div>
      {/* MOVIE INFORMATION */}
      <div
        className="movie-details"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            movie.backdrop_path || movie.poster_path
          })`,
        }}
      >
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="movie-image"
          />
          <WhereToWatch movieId={movie.id} type="movie" />
        </div>
        <div className="content">
          <h1 className="title">
            {movie.title}
            <span className="year">
              ({new Date(movie.release_date).getFullYear()})
            </span>
          </h1>
          <div className="buttons">
            <button
              className={`favorite-in-card ${
                isFavorite(movie.id) ? "active" : ""
              }`}
              onClick={onFavoriteClick}
            >
              ♥
            </button>
            <button
              className={`favorite-in-card ${
                isWatchLater(movie.id) ? "active" : ""
              }`}
              onClick={onWatchLaterClick}
            >
              ✓
            </button>
          </div>
          <p>
            <strong>Overview:</strong>
          </p>
          <p>{movie.overview}</p>
          <p>
            <strong>Runtime: </strong>
            {movie.runtime} minutes
          </p>
          <p>
            <strong>Release Date: </strong>
            {movie.release_date}
          </p>
          <p>
            <strong>Rating: </strong>
            {Math.round(movie.vote_average * 10)}%
          </p>
          <p>
            <strong>Genres: </strong>
            {movie.genres && movie.genres.length > 0
              ? movie.genres.map((genre, index) => (
                  <span key={genre.id}>
                    {genre.name}
                    {index < movie.genres.length - 1 ? ", " : ""}
                  </span>
                ))
              : "NONE"}
          </p>
          <p>
            <strong>In Production: </strong>
            {movie.in_production ? "In production" : "Completed"}
          </p>
        </div>
      </div>
      {/* MOVIE TRAILER SECTION */}
      <div className="trailer">
        {trailers.length > 0 && (
          <div className="trailer-container">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailers[0].key}`}
              title={trailers[0].name}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
      {/* CAST LIST */}
      <div>
        <span className="cast-title">Cast</span>
        <div className="cast-list">
          <button
          className={`scroll-btn scroll-btn-left ${
            !canScrollLeft ? "disabled" : ""
          }`}
          onClick={scrollToPrev}
          disabled={!canScrollLeft}
        >
          <h3>&lt;</h3>
        </button>
          {credit.cast.map((actor) => (
            <Link
              to={`/actor/${actor.id}`}
              key={actor.id}
              className="cast-card"
            >
              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
                    : noProfilePicture
                }
                alt={actor.name}
              />
              <p>
                <strong>{actor.name}</strong>
              </p>
              <p>{actor.character}</p>
            </Link>
          ))}
          <button
          className={`scroll-btn scroll-btn-right ${
            !canScrollRight ? "disabled" : ""
          }`}
          onClick={scrollToNext}
          disabled={!canScrollRight}
        >
          <h3>&gt;</h3>
        </button>
        </div>
      </div>
      {/* MOVIE RECCOMENDATIONS */}
      <div className="recommendations">
        <span className="recommendation-title">More Like {movie.title}</span>
        <div className="recommended-grid">
          {recommendedMovies.map((item) =>
            item.media_type === "movie" ? (
              <MovieCard movie={item} key={item.id} />
            ) : (
              <ShowCard movie={item} key={item.id} />
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
