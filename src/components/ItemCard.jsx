import { useMovieContext } from "../context/MovieContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../css/ItemCard.css";

function ItemCard({ item, itemType }) {
  //entire app is wrapped in MovieProvider and AuthProvider, allowing access to these values
  const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
  const { isAuthenticated } = useAuth();
  const favorite = isFavorite(item.id);
 
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
          <span>{Math.round(item.vote_average * 10)}%</span>
        </p>
      </div>
    </Link>
  );
}

export default ItemCard;
