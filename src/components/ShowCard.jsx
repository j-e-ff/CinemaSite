import "../css/MovieCard.css";
import { useMovieContext } from "../context/MovieContext";
import { Link } from "react-router-dom";

function ShowCard({ movie }) {
  //can grab all these values because entire app was wrapped in MovieProvider
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const favorite = isFavorite(movie.id);

  function onFavoriteClick(e) {
    e.preventDefault();
    if (favorite) removeFromFavorites(movie.id);
    else addToFavorites(movie);
  }

  return (
    <Link to={`/tv/${movie.id}`} className="movie-card">
      <div className="movie-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.name}
        />
        <div className="movie-overlay">
          <button
            className={`favorite-btn ${favorite ? "active" : ""}`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3>{movie.name}</h3>
        <p className="movie-grid-detail">
          <span>{movie.first_air_date?.split("-")[0]}</span>
          <span>{Math.round(movie.vote_average * 10)}%</span>
        </p>
      </div>
    </Link>
  );
}

export default ShowCard;
