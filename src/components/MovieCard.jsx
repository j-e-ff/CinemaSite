import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function MovieCard({ movie }) {
  //can grab all these values because entire app was wrapped in MovieProvider
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const { isAuthenticated } = useAuth();
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    // Check if user is authenticated before allowing list operations
    if (!isAuthenticated) {
      alert("Please log in to add movies to your lists!");
      return;
    }

    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <Link to={`/movie/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${
              isAuthenticated ? (favorite ? "active" : "") : ""
            }`}
            onClick={onFavoriteClick}
            title={
              isAuthenticated ? "Add to favorites" : "Login to add to favorites"
            }
          >
            <span className="material-icons">
              {isFavorite(movie.id) ? "favorite" : "favorite_border"}
            </span>
            <span className="tooltip-text">add to favorites</span>
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-grid-detail">
          <span>{movie.release_date?.split("-")[0]}</span>
          <span>{Math.round(movie.vote_average * 10)}%</span>
        </p>
      </div>
    </Link>
  );
}

export default MovieCard;
