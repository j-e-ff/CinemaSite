import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getShowCredits,
  getShowDetails,
  getShowRecommendations,
  getSeriesImages,
  getShowTrailers,
  getShowRated,
} from "../services/api";
import { useMovieContext } from "../context/MovieContext";
import { useAuth } from "../context/AuthContext";
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
  const [seriesTrailers, setSeriesTrailers] = useState(null);
  const [rating, setRating] = useState(null);
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);

  // scrolling
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
  }, [tvCredit]);

  const scrollToNext = () => {
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.scrollBy({
        left: 800,
        behavior: "smooth",
      });
      // wait fort the smooth scroll to finish
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
      setTimeout(checkScrollPosition, 350);
    }
  };

  //favorite button
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    addToWatchLater,
    removeFromWatchLater,
    isWatchLater,
  } = useMovieContext();

  function onFavoriteClick(e) {
    e.preventDefault();
    // check if the user is authenticated to add to favorites
    if (!isAuthenticated) {
      alert("Please log in to add to favorites!");
      return;
    }

    // authenticated user - proceed with adding/removing from favorites
    if (series && isFavorite(series.id)) {
      removeFromFavorites(series.id);
    } else if (series) {
      addToFavorites(series);
    }
  }
  // adding series to watch later list
  function onWatchLaterClick(e) {
    e.preventDefault();
    // check if user is authenticated to add to watch later
    if (!isAuthenticated) {
      alert("Please log in ot add to watch later!");
      return;
    }

    // authenticated user - proceed with adding/removing from watch later
    if (series && isWatchLater(series.id)) {
      removeFromWatchLater(series.id);
    } else if (series) {
      addToWatchLater(series);
    }
  }

  useEffect(() => {
    async function loadSeries() {
      try {
        const seriesData = await getShowDetails(id);
        const seriesCredits = await getShowCredits(id);
        const recommendations = await getShowRecommendations(id);
        const images = await getSeriesImages(id);
        const trailers = await getShowTrailers(id);
        const seriesRating = await getShowRated(id);
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
        setSeriesTrailers(trailers);
        setRating(seriesRating);
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
            seriesBackdrop?.file_path ||
            series.backdrop_path ||
            series.poster_path
          })`,
        }}
      >
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
            alt={series.name}
            className="movie-image"
          />
          <WhereToWatch movieId={series.id} type="series" />
        </div>
        <div className="content">
          <div className="title-section">
            <h1 className="title">
              {series.name}
              <span className="year">
                ({new Date(series.first_air_date).getFullYear()})
              </span>
            </h1>
            <div className="buttons">
              <button
                className={`favorite-in-card ${
                  isAuthenticated ? (isFavorite(series.id) ? "active" : "") : ""
                }`}
                onClick={onFavoriteClick}
              >
                <span className="material-icons">
                  {isFavorite(series.id) ? "favorite" : "favorite_border"}
                </span>
              </button>
              <button
                className={`favorite-in-card ${
                  isAuthenticated
                    ? isWatchLater(series.id)
                      ? "active"
                      : ""
                    : ""
                }`}
                onClick={onWatchLaterClick}
              >
                <span className="material-icons">
                  {isWatchLater(series.id) ? "watch_later" : "watch_later"}
                </span>
              </button>
              <Link
              to={`/reviews/tv/${series.id}`}
              key={series.id}
              className="review-link"
            >
              <button className="comment-button active">
                <span class="material-icons-outlined">reviews</span>
              </button>
            </Link>
            </div>
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
            <strong>Rating: </strong>
            {rating}
          </p>
          <p>
            <strong>TMDB Rating:</strong> {Math.round(series.vote_average * 10)}
            %
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
        </div>
      </div>
      {/* TRAILER SECTION */}
      {seriesTrailers && seriesTrailers.length > 0 && (
        <div className="trailer">
          <div className="trailer-container">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${seriesTrailers[0].key}`}
              title={seriesTrailers[0].name}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      {/* CAST SECTION */}
      <span className="cast-title">Cast</span>
      <div className="cast-list">
        <button
          className={`cast-scroll-btn  scroll-btn-left ${
            !canScrollLeft ? "disabled" : ""
          }`}
          onClick={scrollToPrev}
          disabled={!canScrollLeft}
        >
          <span class="material-icons-outlined">navigate_before</span>
        </button>
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
        <button
          className={`cast-scroll-btn scroll-btn-right ${
            !canScrollRight ? "disabled" : ""
          }`}
          onClick={scrollToNext}
          disabled={!canScrollRight}
        >
          <span class="material-icons-outlined">navigate_next</span>
        </button>
      </div>
      <div className="recommendations">
        <span className="recommendation-title">More Like {series.name}</span>
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
};

export default TVDetails;
