import { useState, useEffect } from "react";
import { discoverMoviesByGenre, getMovieGenres } from "../services/api";
import DisplayMovies from "../components/DisplayMovies";
import React from "react";
import Select from "react-select";

function Discover() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSort, setSelectedSort] = useState([
    { value: "popularity.desc", lable: "popularity descending" },
  ]);
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
    const fetchGenres = async () => {
      try {
        const genreData = await getMovieGenres();
        const options = genreData.genres.map((genre) => ({
          value: genre.id.toString(),
          label: genre.name,
        }));
        setGenreOptions(options);
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };
    fetchGenres();
  }, []);

  const handleGenreChange = (selectedOptions) => {
    const genreIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
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
    if (selectedGenres.length === 0) {
      setSelectedGenres(["28"]); // default to action
      return;
    }

    const genreString = selectedGenres.join(",");
    setLoading(true);
    async function fetchData() {
      try {
        const data = await discoverMoviesByGenre(
          genreString,
          selectedSort.value,
          page
        );
        setItems(data);
      } catch (err) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [selectedGenres, selectedSort, page]);

  return (
    <div>
      <div className="dropdown">
        <h2>Select Genres</h2>
        <Select
          isMulti
          options={genreOptions}
          onChange={handleGenreChange}
          placeholder="Selected Genres..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <h2>Sort by</h2>
        <Select
          options={sortOptions}
          onChange={handleSortChange}
          placeholder="Sort by..."
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </div>
      <h3>Movies</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DisplayMovies
          movieToggle={true}
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
