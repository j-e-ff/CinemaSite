import React, { useState, useEffect } from "react";
import MovieCard from "./MovieCard";
import ShowCard from "./ShowCard";
import "../css/DisplayMovies.css";

const DisplayMovies = ({ movieToggle, movieList, sectionId, isSearch=false}) => {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);


  const checkScrollPosition = () => {
    const itemsList = document.querySelector(`.movies-list-${sectionId}`);
    if (itemsList) {
      const { scrollLeft, scrollWidth, clientWidth } = itemsList;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const itemsList = document.querySelector(`.movies-list-${sectionId}`);
    if (itemsList) {
      itemsList.addEventListener("scroll", checkScrollPosition);
      return () => itemsList.removeEventListener("scroll", checkScrollPosition);
    }
  }, [sectionId]);

  const scrollToNext = () => {
    const itemsList = document.querySelector(`.movies-list-${sectionId}`);
    if (itemsList) {
      itemsList.scrollBy({
        left: 800,
        behavior: "smooth",
      });
    }
  };

  const scrollToPrev = () => {
    const itemsList = document.querySelector(`.movies-list-${sectionId}`);
    if (itemsList) {
      itemsList.scrollBy({
        left: -800,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="popular-movies-container">
      {!isSearch && <button
        className={`scroll-btn scroll-btn-left ${
          !canScrollLeft ? "disabled" : ""
        }`}
        onClick={scrollToPrev}
        disable={!canScrollLeft}
      >
        <h3>&lt;</h3>
      </button>}
      <div className={`movies-list movies-list-${sectionId}`}>
        {movieList.map((item) =>
          movieToggle ? (
            <MovieCard movie={item} key={item.id} />
          ) : (
            <ShowCard movie={item} key={item.id} />
          )
        )}
      </div>
      {!isSearch && <button
        className={`scroll-btn scroll-btn-right ${
          !canScrollRight ? "disabled" : ""
        }`}
        onClick={scrollToNext}
        disable={!canScrollRight}
      >
        <h3>&gt;</h3>
      </button>}
    </div>
  );
};

export default DisplayMovies;
