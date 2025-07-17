import { useState, useEffect } from "react";
import {
  getMovieDetails,
  getShowDetails,
  getMovieReviews,
  getShowReviews,
} from "../services/api";
import { useParams } from "react-router-dom";
import "../css/CommentsPage.css";

const CommentsPage = () => {
  const { itemType, item_id } = useParams();
  const [itemDetails, setItemDetials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const details =
          itemType === "movie"
            ? await getMovieDetails(item_id)
            : await getShowDetails(item_id);
        const reviewsData =
          itemType === "movie"
            ? await getMovieReviews(item_id)
            : await getShowReviews(item_id);
        setReviews(reviewsData);
        setItemDetials(details);
      } catch (error) {
        consonle.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [itemType, item_id]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="comments-container">
      <div className="title-container">
        <h1 className="title">
          {itemType === "movie" ? itemDetails.title : itemDetails.name} Reviews
        </h1>
      </div>
      <div className="comments-page">
        <div className="poster-section">
          <img
            src={`https://image.tmdb.org/t/p/w500${itemDetails.poster_path}`}
            alt={itemType === "movie" ? itemDetails.title : itemDetails.name}
            className="movie-image"
          />
        </div>
        <div className="comments-section">
          {reviews.length > 0
            ? reviews.map((reviews) => {
                return (
                  <div key={reviews.id} className="comment">
                    <h3>{reviews.author}</h3>
                    <p>{reviews.content}</p>
                  </div>
                );
              })
            : "No reviews yet"}
        </div>
      </div>
    </div>
  );
};

export default CommentsPage;
