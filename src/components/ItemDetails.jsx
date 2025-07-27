import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getMovieDetails,
  getMovieCredits,
  getMovieRecommendations,
  getMovieTrailers,
  getMovieRated,
  getShowCredits,
  getShowDetails,
  getShowRecommendations,
  getSeriesImages,
  getShowTrailers,
  getShowRated,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import WhereToWatch from "../components/WhereToWatch";
import { useMovieContext } from "../context/MovieContext";
import ItemCard from "../components/ItemCard";
import noProfilePicture from "../assets/no-profile-picture.jpg";
import "../css/ItemDetails.css";

function ItemDetails() {
  const { type, id } = useParams(); // getting the item type and its id
  const [item, setItem] = useState([]);
  const [itemCredits, setItemCredits] = useState(null);
  const [itemRecommended, setItemRecommended] = useState(null);
  const [itemTrailer, setItemTrailer] = useState(null);
  const [itemRating, setItemRating] = useState(null);
  const [itemBackdrops, setItemBackdrops] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  // favorite and wathch later
  const {
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    isWatchLater,
    addToWatchLater,
    removeFromWatchLater,
  } = useMovieContext();

  // scrolling
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function onFavoriteClick(e) {
    e.preventDefault();
    // check if user is authenticated before allowing list operations
    if (!isAuthenticated) {
      alert("please log in to add to favorites!");
    }

    if (item && isFavorite(item.id)) {
      removeFromFavorites(item.id);
    } else if (item) {
      addToFavorites(item);
    }
  }

  function onWatchLaterClick(e) {
    e.preventDefault();
    // check if user is authenticated before allowing list operations
    if (!isAuthenticated) {
      alert("please log in to add to watch later!");
      return;
    }

    if (item && isWatchLater(item.id)) {
      removeFromWatchLater(item.id);
    } else if (item) {
      addToWatchLater(item);
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

  const scrollToNext = () => {
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.scrollBy({
        left: 800,
        behavior: "smooth",
      });
      // wait for smooth scroll to finish
      setTimeout(checkScrollPosition, 500);
    }
  };

  const scrollToPrev = () => {
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.scrollBy({
        left: -800,
        behavior: "smooth",
      });
      // wait for smooth scroll to finish
      setTimeout(checkScrollPosition, 500);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const cast = document.querySelector(".cast-list");
    if (cast) {
      cast.addEventListener("scroll", checkScrollPosition);
      return () => cast.removeEventListener("scroll", checkScrollPosition);
    }
  }, [itemCredits]);

  useEffect(() => {
    async function fetchData() {
      try {
        const itemDetails =
          type === "movie"
            ? await getMovieDetails(id)
            : await getShowDetails(id);
        setItem(itemDetails);

        const credits =
          type === "movie"
            ? await getMovieCredits(id)
            : await getShowCredits(id);
        setItemCredits(credits);

        const recommendations =
          type === "movie"
            ? await getMovieRecommendations(id)
            : await getShowRecommendations(id);
        setItemRecommended(recommendations);

        const trailer =
          type == "movie"
            ? await getMovieTrailers(id)
            : await getShowTrailers(id);
        setItemTrailer(trailer);

        const rating =
          type === "movie" ? await getMovieRated(id) : await getShowRated(id);
        setItemRating(rating);

        const images = type === "movie" ? [] : await getSeriesImages(id);
        // Selecting random backdrop from seriesImages
        if (images.backdrops && images.backdrops.length > 0) {
          const randomIndex = Math.floor(
            Math.random() * images.backdrops.length
          );
          setItemBackdrops(images.backdrops[randomIndex]);
        } else if (itemDetails.backdrop_path) {
          // Fallback to the main backdrop if no additional backdrops available
          setItemBackdrops({ file_path: itemDetails.backdrop_path });
        }
      } catch (err) {
        console.error(
          `Error fetching item details for type=${type}, ${id}`,
          err
        );
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div>Loading details...</div>;
  if (!item) return <div>Error, item not found</div>;

  const directorNames =
    type === "movie"
      ? itemCredits && itemCredits.crew
        ? itemCredits.crew
            .filter((member) => member.job === "Director")
            .map((d) => d.name)
            .join(", ")
        : "Unknown"
      : "";

  return (
    <div className="item-details-container">
      <div
        className="item-details"
        style={
          type === "movie"
            ? {
                backgroundImage: `url(https://image.tmdb.org/t/p/original${
                  item.backdrop_path || item.poster_path
                })`,
              }
            : {
                backgroundImage: `url(https://image.tmdb.org/t/p/original${
                  itemBackdrops?.file_path ||
                  item.backdrop_path ||
                  item.poster_path
                })`,
              }
        }
      >
        <div className="left-section">
          <img
            src={`https://image.tmdb.org/t/p/original${item.poster_path}`}
            alt={type === "movie" ? item.title : item.name}
            className="item-image"
          />
          {/* BUTTON SECTION */}
          <div className="buttons">
            <button
              className={`in-list ${
                isAuthenticated ? (isFavorite(item.id) ? "active" : "") : ""
              }`}
              onClick={onFavoriteClick}
              aria-label="favorite"
            >
              <span className="material-icons">
                {isFavorite(item.id) ? "favorite" : "favorite_border"}
              </span>
              <span className="tooltip-text">add to favorites</span>
            </button>
            <button
              className={`in-list ${
                isAuthenticated ? (isWatchLater(item.id) ? "active" : "") : ""
              }`}
              onClick={onWatchLaterClick}
              aria-label="watch later"
            >
              <span className="material-icons">
                {isWatchLater(item.id) ? "watch_later" : "watch_later"}
              </span>
              <span className="tooltip-text">add to watch later</span>
            </button>
            <Link
              to={`/reviews/${type}/${item.id}`}
              key={item.id}
              className="review-link"
            >
              <button className="comment-button">
                <span className="material-icons-outlined">reviews</span>
                <span className="tooltip-text"> see reviews </span>
              </button>
            </Link>
          </div>
          <WhereToWatch movieId={item.id} type={type} />
        </div>
        <div className="content">
          <h1 className="title">
            {type === "movie" ? item.title : item.name}
            <span className="year">
              (
              {type === "movie"
                ? item.release_date
                  ? new Date(item.release_date).getFullYear()
                  : "N/A"
                : item.first_air_date
                ? new Date(item.first_air_date).getFullYear()
                : "N/A"}
              )
            </span>
          </h1>
          {/* Details  */}
          <p style={{ whiteSpace: "pre-line" }}>
            <strong>Overview: </strong>

            {item.overview}
            {"\n\n"}
            {type === "movie" ? (
              <>
                <strong>Director:</strong> {directorNames}
                {"\n\n"}
                <strong>Runtime: </strong> {item.runtime} minutes
                {"\n\n"}
                <strong>Release Date: </strong> {item.release_date}
                {"\n\n"}
                <strong>Rating: </strong> {itemRating || "Not Rated"}
                {"\n\n"}
                <strong>TMDB Rating: </strong>{" "}
                {Math.round(item.vote_average * 10)}%{"\n\n"}
                <strong>Genres: </strong>
                {item.genres && item.genres.length > 0
                  ? item.genres.map((genre) => genre.name).join(", ")
                  : "NONE"}
                {"\n\n"}
                <strong>In Production: </strong>
                {item.in_production ? "yes" : "Completed"}
              </>
            ) : (
              <>
                <strong>Created by: </strong>
                {item.created_by && item.created_by.length > 0
                  ? item.created_by.map((creator, index) => (
                      <span key={creator.id}>
                        {creator.name}
                        {index < item.created_by.length - 1 ? ", " : ""}
                      </span>
                    ))
                  : "N/A"}
                  {"\n\n"}
                <strong>Episode Runtime: </strong> {item.episode_runtime} minutes
                {"\n\n"}
                <strong>First Air Date: </strong> {item.first_air_date}
                {"\n\n"}
                <strong>Rating: </strong> {itemRating || "Not Rated"}
                {"\n\n"}
                <strong>TMDB Rating: </strong>{Math.round(item.vote_average * 10)}%
                {"\n\n"}
                <strong>Number of Seasons: </strong> {item.number_of_seasons}
                {"\n\n"}
                <strong>Number of Episodes: </strong> {item.number_of_episodes}
                {"\n\n"}
                <strong>Genres : </strong>
                {item.genres && item.genres.length > 0
                  ? item.genres.map((genre) => genre.name).join(", ")
                  : "NONE"}
                <strong>In Production: </strong>{" "}
                {item.in_production ? "yes" : "completed"}
              </>
            )}
          </p>
        </div>
      </div>
      {/*  TRAILER SECTION */}
      <div className="trailer">
        <h2>Trailer</h2>
        {itemTrailer.length > 0 && (
          <div className="trailer-container">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${itemTrailer[0].key}`}
              title={itemTrailer[0].name}
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>
      {/* CAST SECTION */}
      <div>
        <span className="cast-title">Cast</span>
        <div className="cast-list">
          <button
            className={`cast-scroll-btn  scroll-btn-left ${
              !canScrollLeft ? "disabled" : ""
            }`}
            onClick={scrollToPrev}
            disabled={!canScrollLeft}
          >
            <span className="material-icons-outlined">navigate_before</span>
          </button>
          {itemCredits.cast.map((actor) => (
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
            className={`cast-scroll-btn scroll-btn-right ${
              !canScrollRight ? "disabled" : ""
            }`}
            onClick={scrollToNext}
            disabled={!canScrollRight}
          >
            <span className="material-icons-outlined">navigate_next</span>
          </button>
        </div>
      </div>
      {/* RECOMMENDATIONS */}
      <div className="recommendations">
        <span className="recommendation-title">
          More Like {type === "movie" ? item.title : item.name}
        </span>
        <div className="recommended-grid">
          {itemRecommended.map((item) => (
            <ItemCard item={item} itemType={item.media_type} key={item.id} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ItemDetails;
