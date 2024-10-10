import React from "react";
import { Link } from "react-router-dom";
import FormatDate from "../utils/FormatDate";

function Card(props) {
  return (
    <article className="post-card" key={props.post.id}>
      <div className="post-image">
        <img
          src={`http://localhost:9000/images/${props.post.url}`}
          alt={`Image for ${props.post.title}`}
          loading="lazy" // Improves page load time
        />
      </div>
      <div className="post-content">
        <h2 className="post-title">{props.post.title}</h2>
        <p className="post-description">{props.post.description}</p>
        <div className="post-categories">
          <span className="post-category">{props.post.label}</span>
        </div>
        <p>
          par {props.post.author || "Unknown"} le{" "}
          {FormatDate(props.post.publish_date).toLocaleDateString()} à{" "}
          {FormatDate(props.post.publish_date).toLocaleTimeString()}
        </p>
        <Link
          to={`/post/${props.post.id}`}
          className="read-more-button"
          aria-label={`Read more about ${props.post.title}`}
        >
          Learn More
        </Link>
      </div>
    </article>
  );
}

export default Card;
