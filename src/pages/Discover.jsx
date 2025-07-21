import { useState, useEffect } from "react";
import {
  discoverMoviesByGenre,
  getMovieGenres,
  discoverShowsByGenre,
  getShowGenres,
} from "../services/api";
import DisplayMovies from "../components/DisplayMovies";
import Select from "react-select";
import "../css/Discover.css";

function Discover({ movieToggle }) {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSort, setSelectedSort] = useState({
    value: "popularity.desc",
    label: "popularity descending",
  });
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [genreOptions, setGenreOptions] = useState([]);
  const sortOptions = [
    { value: "popularity.desc", label: "popularity descending" },
    { value: "popularity.asc", label: "popularity ascending" },
    { value: "original_title.desc", label: "original title descending" },
    { value: "original_title.asc", label: "original title ascending" },
    { value: "revenue.desc", label: "revenue descending" },
    { value: "revenue.asc", label: "revenue ascending" },
    { value: "primary_release_date.desc", label: "release date descending" },
    { value: "primary_release_date.asc", label: "release date ascending" },
    { value: "title.desc", label: "title descending" },
    { value: "title.asc", label: "title ascending" },
    { value: "vote_average.desc", label: "vote average descending" },
    { value: "vote_average.asc", label: "vote average ascending" },
    { value: "vote_count.desc", label: "vote count descending " },
    { value: "vote_count.asc", label: "vote count ascending" },
  ];

  // fetch genre component
  useEffect(() => {
    console.log("movieToggle changed to:", movieToggle);
    const fetchGenres = async () => {
      try {
        const genreData = movieToggle
          ? await getMovieGenres()
          : await getShowGenres();
        const options = genreData.genres.map((genre) => ({
          value: genre.id.toString(),
          label: genre.name,
        }));
        setGenreOptions(options);
        // Clear items and reset selected genres when switching between movies and shows
        setItems([]);
        setSelectedGenres([]);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, [movieToggle]);

  const handleGenreChange = (selectedOptions) => {
    const genreIds = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedGenres(genreIds);
    setPage(1);
  };

  const handleSortChange = (selectedOption) => {
    setSelectedSort(selectedOption);
    setPage(1);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    setPage((prev) => Math.max(1, prev - 1));
  };

  useEffect(() => {
    // Set default genre if none selected
    if (selectedGenres.length === 0) {
      const defaultGenre = movieToggle ? "28" : "10759"; // default to action
      setSelectedGenres([defaultGenre]);
      return;
    }

    const genreString = selectedGenres.join(",");
    console.log("Fetching data with:", {
      movieToggle,
      genreString,
      sortBy: selectedSort.value,
      page,
    });
    setLoading(true);
    async function fetchData() {
      try {
        const data = movieToggle
          ? await discoverMoviesByGenre(genreString, selectedSort.value, page)
          : await discoverShowsByGenre(genreString, selectedSort.value, page);
        console.log("Fetched data:", data);
        setItems(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedGenres, selectedSort, page, movieToggle]);

  return (
    <div className="discover-container">
      <div className="dropdown">
        <h2>Select Genres</h2>
        <Select
          isMulti
          options={genreOptions}
          onChange={handleGenreChange}
          placeholder="Selected Genres..."
          className="basic-multi-select"
          classNamePrefix="select"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "lightblue",
              primary: "black",
            },
          })}
          styles={{
            multiValue: (base) => ({
              ...base,
              backgroundColor: "rgb(38,135,196)",
              color: "white",
            }),
            multiValueLabel: (base) => ({
              ...base,
              color: "white",
            }),
            multiValueRemove: (base) => ({
              ...base,
              color: "white",
              ":hover": {
                backgroundColor: "rgb(191, 31, 31)",
                color: "white",
              },
            }),
          }}
        />
        <h2>Sort by</h2>
        <Select
          options={sortOptions}
          onChange={handleSortChange}
          placeholder="Sort by..."
          className="basic-multi-select"
          classNamePrefix="select"
          theme={(theme) => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary25: "lightblue",
              primary: "rgb(43, 162, 235)",
            },
          })}
        />
      </div>
      <h3>{movieToggle ? "Movies" : "TV"}</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DisplayMovies
          movieToggle={movieToggle}
          movieList={items}
          sectionId="discover"
          isSearch={true}
        />
      )}
      <div className="pagination-controls">
        <button
          className="discover-prev"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          prev
        </button>
        <span>Page {page}</span>
        <button className="discover-next" onClick={handleNextPage}>
          next
        </button>
      </div>
    </div>
  );
}

export default Discover;
