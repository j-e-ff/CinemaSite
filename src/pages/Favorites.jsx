import "../css/Favorites.css";
import { useMovieContext } from "../context/MovieContext";
import MovieCard from "../components/MovieCard";
import ShowCard from "../components/ShowCard";

function Favorites() {
  const { favorites } = useMovieContext();

  if (favorites && favorites.length > 0) {
    return (
      <div className="favorites">
        <h2>Favorites List</h2>
        <div className="movies-grid">
          {favorites.map((item) =>  item.title?(
            <MovieCard movie={item} key={item.id} />
          ):
          (
            <ShowCard movie={item} key={item.id} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-empty">
      <h2>No Favorite Movies Yet</h2>
      <p>
        <strong>
          Add stuff to the list to see them
        </strong>
      </p>
    </div>
  );
}

export default Favorites;
