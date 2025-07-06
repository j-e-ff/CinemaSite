import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getShowCredits,
  getShowDetails,
  getShowRecommendations,
  getSeriesImages,
} from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";
import noProfilePicture from "../assets/no-profile-picture.jpg";
import WhereToWatch from "../components/WhereToWatch";
import "../css/TVDetails.css";

function TVDetails() {
  const { id } = useParams();
  const [series, setSeries] = useState(null); //getting the series
  const [tvCredit, setTVCredit] = useState(null);
  const [recommendedShows, setRecommendedShows] = useState(null);
  const [seriesBackdrop, setSeriesBackdrop] = useState(null);
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
        const recommendations = await getShowRecommendations(id);
        const images = await getSeriesImages(id);
        // Selecting random backdrop from seriesImages
        if (images.backdrops && images.backdrops.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * images.backdrops.length
          );
          setSeriesBackdrop(images.backdrops[randomIndex]);
        } else if (seriesData.backdrop_path) {
          // Fallback to the main backdrop if no additional backdrops available
          setSeriesBackdrop({ file_path: seriesData.backdrop_path });
        }
        setRecommendedShows(recommendations);
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
      <div className="movie-details">
        <img
          src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
          alt={series.name}
        />
        <div
          className="content"
          style={{
            backgroundImage: `url(https://image.tmdb.org/t/p/original${
              seriesBackdrop?.file_path ||
              series.backdrop_path ||
              series.poster_path
            })`,
          }}
        >
          <div className="title-section">
            <h1 className="title">{series.name}
              <span className="year">({new Date(series.first_air_date).getFullYear()})</span>
            </h1>
            <button
              className={`favorite-in-card ${
                isFavorite(series.id) ? "active" : ""
              }`}
              onClick={onFavoriteClick}
            >
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
            <strong>Episode Runtime: </strong>
            {series.episode_run_time} minutes
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
          <p>
            <strong>In Production: </strong>
            {series.in_production ? "Returning" : "Completed"}
          </p>
          <WhereToWatch movieId={series.id} type="series" />
        </div>
      </div>
      <div className="cast-list">
        {tvCredit.cast.map((actor) => (
          <Link to={`/actor/${actor.id}`} key={actor.id} className="cast-card">
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
            <p>
              {actor.roles && actor.roles.length > 0 ? (
                actor.roles.map((roles, index) => (
                  <p key={index}>{roles.character}</p>
                ))
              ) : (
                <p>character information not available</p>
              )}
            </p>
          </Link>
        ))}
      </div>
      <div className="recommendations">
        <h2 className="recommendation-title">More Like This</h2>
        <div className="recommended-grid">
          {recommendedShows.map((item) =>
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

export default TVDetails;
