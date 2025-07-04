import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPeople, getExternalIDs } from "../services/api";
import instagram from "../assets/instagram-svgrepo-com.svg";
import facebook from "../assets/facebook-svgrepo-com.svg";
import tiktok from "../assets/tiktok-svgrepo-com.svg";
import youtube from "../assets/youtube-svgrepo-com.svg";

const ActorsPage = () => {
  const { id } = useParams();
  const [actor, setActor] = useState(null);
  const [externalIDs, setExternalIDs] = useState(null); // getting the external IDs of the actor
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPerson() {
      try {
        const actorData = await getPeople(id);
        const externalData = await getExternalIDs(id);
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
    <div>
      actors page
      <img
        src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
        alt=""
        className="actor-image"
      />
      <h2 className="actor-name">{actor.name}</h2>
      <p>{actor.biography}</p>
      <p>{actor.birthday}</p>
      <p>{actor.gender == "1" ? "Female" : "Male"}</p>
      {externalIDs.instagram_id && (
        <p>
          <a
            href={`https://www.instagram.com/${externalIDs.instagram_id}`}
            target="_blank"
            rel="noopner noreferrer"
          >
            <img src={instagram} alt="Instagram" className="social-icon" />
          </a>
        </p>
      )}
      {externalIDs.tiktok_id && (
        <p>
          <a
            href={`https://www.tiktok.com/@${externalIDs.tiktok_id}`}
            target="_blank"
            rel="noopner noreferrer"
          >
            <img src={tiktok} alt="Instagram" className="social-icon" />
          </a>
        </p>
      )}
      {externalIDs.facebook_id && (
        <p>
          <a
            href={`https://www.facebook.com/${externalIDs.facebook_id}`}
            target="_blank"
            rel="noopner noreferrer"
          >
            <img src={facebook} alt="Instagram" className="social-icon" />
          </a>
        </p>
      )}
      {externalIDs.youtube_id && (
        <p>
          <a
            href={`https://www.youtube.com/@${externalIDs.youtube_id}`}
            target="_blank"
            rel="noopner noreferrer"
          >
            <img src={youtube} alt="Instagram" className="social-icon" />
          </a>
        </p>
      )}
    </div>
  );
};

export default ActorsPage;
