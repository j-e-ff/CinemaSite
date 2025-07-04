import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPeople, getExternalIDs, getCombinedCredits } from "../services/api";
import instagram from "../assets/instagram-svgrepo-com.svg";
import facebook from "../assets/facebook-svgrepo-com.svg";
import tiktok from "../assets/tiktok-svgrepo-com.svg";
import youtube from "../assets/youtube-svgrepo-com.svg";
import "../css/ActorsPage.css";

const ActorsPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [externalIDs, setExternalIDs] = useState(null); // getting the external IDs of the actor
  const [combinedCredits, setCombinedCredits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const sortedCast = combinedCredits?.cast
    ? [...combinedCredits.cast].sort((a, b) => {
        // handle missing or invalid dates
        const yearA = a.release_date
          ? parseInt(a.release_date.slice(0, 4))
          : a.first_air_date
          ? parseInt(a.first_air_date.slice(0, 4))
          : 0;

        const yearB = b.release_date
          ? parseInt(b.release_date.slice(0, 4))
          : b.first_air_date
          ? parseInt(b.first_air_date.slice(0, 4))
          : 0;
        return yearB - yearA;
      })
    : [];
  const paginatedCredits = sortedCast.slice(startIndex, endIndex) || [];
  const totalPages = combinedCredits
    ? Math.ceil(combinedCredits.cast.length / itemsPerPage)
    : 1;

  useEffect(() => {
    async function loadPerson() {
      try {
        const actorData = await getPeople(id);
        const externalData = await getExternalIDs(id);
        const creditsData = await getCombinedCredits(id);
        setCombinedCredits(creditsData);
        setExternalIDs(externalData);
        setActor(actorData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    loadPerson();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!actor) return <div>Actor was not found</div>;
  return (
    <div className="actors-page">
      <div className="actor-container">
        <div className="actor-left">
          <img
            src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
            alt={actor.name}
            className="actor-image"
          />
          <div className="social-links">
            {externalIDs.instagram_id && (
              <a
                href={`https://www.instagram.com/${externalIDs.instagram_id}`}
                target="_blank"
                rel="noopner noreferrer"
              >
                <img src={instagram} alt="Instagram" className="social-icon" />
              </a>
            )}
            {externalIDs.tiktok_id && (
              <a
                href={`https://www.tiktok.com/@${externalIDs.tiktok_id}`}
                target="_blank"
                rel="noopner noreferrer"
              >
                <img src={tiktok} alt="TikTok" className="social-icon" />
              </a>
            )}
            {externalIDs.facebook_id && (
              <a
                href={`https://www.facebook.com/${externalIDs.facebook_id}`}
                target="_blank"
                rel="noopner noreferrer"
              >
                <img src={facebook} alt="Facebook" className="social-icon" />
              </a>
            )}
            {externalIDs.youtube_id && (
              <a
                href={`https://www.youtube.com/@${externalIDs.youtube_id}`}
                target="_blank"
                rel="noopner noreferrer"
              >
                <img src={youtube} alt="YouTube" className="social-icon" />
              </a>
            )}
          </div>
          <div className="known-as-list">
            <h3>Also Known As</h3>
            {actor.also_known_as.map((name, index) => (
              <div key={index} className="name-list">
                {name}
              </div>
            ))}
          </div>
        </div>
        <div className="actor-details">
          <h2 className="actor-name">{actor.name}</h2>
          <p>
            <strong>Biography</strong>
          </p>
          <p className="actor-bio">{actor.biography}</p>
          <p className="actor-birthday">
            <strong>Birthday: </strong>
            {actor.birthday}
          </p>
          <p className="actor-gender">
            <strong>Gender: </strong>
            {actor.gender == "1" ? "Female" : "Male"}
          </p>
          <p>
            <strong>Known for: </strong>
            {actor.known_for_department}
          </p>
          <div className="actor-credits">
            <h3>Filmography</h3>
            <div className="credits-list">
              {paginatedCredits.map((credit, index) => (
                <Link
                  to={
                    credit.media_type === "movie"
                      ? `/movie/${credit.id}`
                      : `/tv/${credit.id}`
                  }
                  key={credit.id}
                  className="credit-card"
                >
                  <div key={index} className="credit-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${credit.poster_path}`}
                      alt={credit.title}
                      className="credit-poster"
                    />
                    <div className="credit-info">
                      <span className="credit-title">
                        {credit.title || credit.name} ({" "}
                        {credit.media_type === "tv" ? "series" : "movie"} )
                      </span>
                      <span className="credit-character">
                        as {credit.character || "self"}
                      </span>
                      <span>
                        {credit.release_date || credit.first_air_date}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              prev
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorsPage;
