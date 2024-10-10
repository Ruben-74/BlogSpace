import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import formatDate from "../utils/FormatDate";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    document.title = "Post - " + post?.title;
  }, [post]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await fetch(
          `http://localhost:9000/api/v1/post/post/${id}`
        );
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

    async function fetchComments() {
      try {
        const response = await fetch(`/api/v1/comment/all-from-story/${id}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des commentaires");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    }

    fetchPost();
    fetchComments();
  }, [id]);

  return (
    <section className="post-container">
      {post ? (
        <>
          <h1 className="post-title">{post.title}</h1>
          <div className="post-image">
            <img
              src={`http://localhost:9000/images/${post.url}`}
              alt={post.title}
            />
          </div>
          <p className="post-description">
            <span>Description : </span>

            {post.description}
          </p>
          <p className="post-date">
            {formatDate(post.publish_date).toLocaleDateString()} à{" "}
            {formatDate(post.publish_date).toLocaleTimeString()}
          </p>
          <div className="post-categories">
            <span className="post-category">{post.label}</span>
          </div>
          <aside>
            <h2>Commentaires</h2>
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Comment key={comment.id} comment={comment} />
              ))
            ) : (
              <p>Aucun commentaire.</p>
            )}
          </aside>
        </>
      ) : (
        <p>Chargement...</p>
      )}
    </section>
  );
}

export default PostDetail;
