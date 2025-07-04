import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieRatings,
} from "../services/api";
import "../css/MovieDetails.css";
import { useMovieContext } from "../context/MovieContext";
import noProfilePicture from "../assets/no-profile-picture.jpg";

function MovieDetails() {
  const { id } = useParams(); //getting the movie id
  const [movie, setMovie] = useState(null);
  const [credit, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  //favorite button
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  function onFavoriteClick(e) {
    e.preventDefault();
    if (movie && isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else if (movie) {
      addToFavorites(movie);
    }
  }

  useEffect(() => {
    async function loadMovie() {
      try {
        const movieData = await getMovieDetails(id);
        const movieCredits = await getMovieCredits(id);
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
      <div
        className="movie-details"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            movie.backdrop_path || movie.poster_path
          })`,
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />
        <div className="content">
          <h1 className="title">{movie.title}</h1>
          <button
            className={`favorite-in-card ${
              isFavorite(movie.id) ? "active" : ""
            }`}
            onClick={onFavoriteClick}
          >
            ♥
          </button>
          <p>
            <strong>Overview:</strong>
          </p>
          <p>{movie.overview}</p>
          <p><strong>Runtime: </strong>{movie.runtime} minutes</p>
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
      <div>
        <div className="cast-list">
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
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
