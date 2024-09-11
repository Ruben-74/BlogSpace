import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PostDetail() {
  const [post, setPost] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(`http://localhost:9000/api/v1/post/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du post");
        }
        const data = await response.json();
        console.log(data);
        setPost(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    }
    fetchPost();
  }, [id]);

  return (
    <section className="post-container">
      {post ? (
        <>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-image">
            <img src={`../../public/images/${post.url}`} alt={post.title} />
          </div>
          <p className="post-description">
            <span>Description : </span>
            <hr />
            {post.description}
          </p>
          <p className="post-date">
            Publié le : {new Date(post.publish_date).toLocaleDateString()}
          </p>
          <div className="post-categories">
            <span lassName="post-category">{post.label}</span>
          </div>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </section>
  );
}

export default PostDetail;
