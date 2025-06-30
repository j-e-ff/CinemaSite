import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getShowCredits, getShowDetails } from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import "../css/TVDetails.css";

function TVDetails() {
  const { id } = useParams();
  const [series, setSeries] = useState(null); //getting the series
  const [tvRating, setTVRating] = useState(null);
  const [tvCredit, setTVCredit] = useState(null);
  const [loading, setLoading] = useState(true);

  //favorite button
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();

  function onFavoriteClick(e) {
    e.preventDefault();
    if (series && isFavorite(series.id)) {
      removeFromFavorites(series.id);
    } else if (series) {
      addToFavorites(series);
    }
  }

  useEffect(() => {
    async function loadSeries() {
      try {
        const seriesData = await getShowDetails(id);
        const seriesCredits = await getShowCredits(id);
        setSeries(seriesData);
        setTVCredit(seriesCredits);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadSeries();
  }, [id]);

  if (loading) return <div>Loading series details</div>;
  if (!series) return <div>Error, series not found</div>;
  return (
    <div>
      <div
        className="movie-details"
        style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/original${
            series.backdrop_path || series.poster_path
          })`,
        }}
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
        />
        <div className="content">
          <div className= "title-section">
            <h1 className="title">{series.name}</h1>
            <button 
        className={`favorite-in-card ${isFavorite(series.id) ? "active" : ""}`}
        onClick={onFavoriteClick}>
          ♥
        </button>
          </div>
          <p>
            <strong>Overview:</strong>
          </p>
          <p>{series.overview}</p>
          <p>
            <strong>Created by: </strong>
            {series.created_by && series.created_by.length > 0
              ? series.created_by.map((creator, index) => (
                  <span key={creator.id}>
                    {creator.name}
                    {index < series.created_by.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Unknown"}
          </p>
          <p>
            <strong>First Air Date:</strong> {series.first_air_date}
          </p>
          <p>
            <strong> Rating:</strong> {Math.round(series.vote_average * 10)}%
          </p>
          <p>
            <strong>Number of Episodes:</strong> {series.number_of_episodes}
          </p>
          <p>
            <strong>Number of Seasons:</strong> {series.number_of_seasons}
          </p>
          <p>
            <strong>Genres: </strong>
            {series.genres && series.genres.length > 0
              ? series.genres.map((genre, index) => (
                  <span key={genre.id}>
                    {genre.name}
                    {index < series.genres.length - 1 ? ", " : ""}
                  </span>
                ))
              : "Unknown"}
          </p>
          <p><strong>In Production: </strong>{series.in_production ? "Returning":"Completed"}</p>
        </div>
      </div>
      <div className="cast-list">
        {tvCredit.cast.map((actor) => (
          <div key={actor.id} className="cast-card">
            <img
              src={
                actor.profile_path
                  ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                  : "https://placehold.co/200x300/cccccc/666666?text=No+Image"
              }
              alt={actor.name}
            />
            <p>
              <strong>{actor.name}</strong>
            </p>
            <p>{actor.character}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TVDetails;
