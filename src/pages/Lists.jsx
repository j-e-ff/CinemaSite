import React, { useState } from "react";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";
import "../css/Lists.css";

function Lists() {
  const { favorites, watchLater } = useMovieContext();
  const [showFavorites, setShowFavorites] = useState(null);

  const list = showFavorites ? watchLater : favorites;
  const title = showFavorites ? "Watch Later" : "Favorites";

  return (
    <div className="lists">
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setShowFavorites((prev) => !prev)}>
          {showFavorites ? "Show Favorites" : "Show Watch Later"}
        </button>
      </div>
      <h2>{title}</h2>
      {list && list.length > 0 ? (
        <div className="movies-grid">
          {list
            .filter((item) => item && item.id) // Filter out any null/undefined items
            .map((item) =>
              item.title ? (
                <MovieCard movie={item} key={item.id} />
              ) : (
                <ShowCard movie={item} key={item.id} />
              )
            )}  
        </div>
      ) : (
        <div className="empty">
          <h2>No items in list</h2>
          <p>
            <strong>Add items to the list to see them</strong>
          </p>
        </div>
      )}
    </div>
  );
}

export default Lists;
