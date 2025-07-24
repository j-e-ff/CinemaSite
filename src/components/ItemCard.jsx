import { useState } from "react";
import { useMovieContext } from "../context/MovieContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/joy/CircularProgress";
import Typography from "@mui/joy/Typography";
import { useCountUp } from "use-count-up";
import "../css/ItemCard.css";

function ItemCard({ item, itemType }) {
  //entire app is wrapped in MovieProvider and AuthProvider, allowing access to these values
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const { isAuthenticated } = useAuth();
  const favorite = isFavorite(item.id);

  // circular progress for vote
  const [isLoading, setIsLoading] = useState(true);
  const { value } = useCountUp({
    isCounting: isLoading,
    duration: 1,
    start: 0,
    end: Math.round(item.vote_average * 10),
    onComplete: () => {
      setIsLoading(false);
    },
  });

  function onFavoriteClick(e) {
    e.preventDefault();
    // Check if the user is authenticated before allowing list operations
    if (!isAuthenticated) {
      alert("Please log in to add items to your lists!");
      return;
    }

    if (favorite) removeFromFavorites(item.id);
    else addToFavorites(item);
  }
  return (
    <Link
      to={itemType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`}
      className="item-card"
    >
      <div className="item-poster">
        <img
          src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
          alt={itemType === "movie" ? item.title : item.name}
        />
        <div className="item-overlay">
          <button
            className={`favorite-btn ${
              isAuthenticated ? (favorite ? "active" : "") : ""
            }`}
            onClick={onFavoriteClick}
          >
            <span className="material-icons">
              {isFavorite(item.id) ? "favorite" : "favorite_border"}
            </span>
            <span className="tooltip-text">add to </span>
          </button>
        </div>
        
      </div>
      <div className="item-info">
        <h3>{itemType === "movie" ? item.title : item.name}</h3>
        <p className="item-grid-detail">
          <span>
            {itemType === "movie"
              ? item.release_date?.split("-")[0]
              : item.first_air_date?.split("-")[0]}
          </span>
          <CircularProgress
            size="lg"
            determinate
            value={value}
            sx={{
              "--CircularProgress-size": "33px",
              "--CircularProgress-trackThickness": "2px",
              "--CircularProgress-progressThickness": "2px",
            }}
            color="success"
          >
            <Typography level="body-xs" textColor="#ccc" sx={{ fontSize: ".7rem" }}>
              {value}%
            </Typography>
          </CircularProgress>
        </p>
      </div>
    </Link>
  );
}

export default ItemCard;
