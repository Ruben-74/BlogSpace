import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import formatDate from "../utils/FormatDate";
import Comment from "./Partials/Comment";
import { useSelector } from "react-redux";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  const fetchPost = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/post/${id}`);
      if (!response.ok)
        throw new Error("Erreur lors de la récupération du post");
      const data = await response.json();
      setPost(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/${id}`
      );
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des commentaires");

      const datas = await response.json();
      console.log(datas); // Vérifie le format ici

      const commentMap = {};
      datas.forEach((comment) => {
        commentMap[comment.id] = {
          ...comment,
          replies: [], // Initialiser les réponses
        };
      });

      // Associer les réponses à leurs commentaires parents
      datas.forEach((comment) => {
        if (comment.parent_id) {
          commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
        }
      });

      // Filtrer uniquement les commentaires principaux (sans parent_id)
      const commentList = Object.values(commentMap).filter(
        (comment) => !comment.parent_id
      );
      setComments(commentList);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoadingComments(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id, user.isLogged]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user.isLogged) {
      setError("Vous devez être connecté pour commenter.");
      return;
    }

    const data = {
      message,
      post_id: Number(id),
      user_id: user.userId,
      parent_id: null,
      username: user.username,
      avatar_label: user.avatar,
    };

    console.log("submit", data);

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur: ${errorData.msg || "Erreur inconnue"}`);
      }

      const newComment = await response.json();

      // Ajouter le nouveau commentaire à l'état sans refaire fetch
      setComments((prev) => [...prev, newComment]);
      setMessage(""); // Réinitialiser le message
    } catch (error) {
      setError(error.message);
    }
  };

  const handleReplySubmit = async (commentId, replyMessage) => {
    console.log("Suppression du commentaire avec ID:", commentId);
    if (!user.isLogged) {
      setError("Vous devez être connecté pour répondre.");
      return;
    }

    if (!replyMessage.trim()) {
      setError("Le message de réponse ne peut pas être vide.");
      return;
    }

    const data = {
      message: replyMessage,
      post_id: Number(id),
      parent_id: commentId,
      user_id: user.userId,
      username: user.username,
      avatar_label: user.avatar, // Assure-toi que l'avatar est passé ici
    };

    console.log(data);

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Erreur lors de l'envoi de la réponse: ${
            errorData.msg || "Erreur inconnue"
          }`
        );
      }

      const newReply = await response.json();
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
    } catch (error) {
      console.error("Erreur dans handleReplySubmit:", error);
      setError(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/remove/${commentId}`,
        {
          method: "DELETE",
          credentials: "include", // Pour envoyer les cookies de session
        }
      );

      // Vérifier la réponse du serveur
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du commentaire.");
      }

      // Mettre à jour l'état des commentaires
      setComments((prevComments) =>
        prevComments
          .filter((comment) => comment.id !== commentId) // Supprime le commentaire principal
          .map((comment) => ({
            ...comment,
            replies: comment.replies.filter((reply) => reply.id !== commentId), // Supprime la réponse si c'est un commentaire
          }))
      );
    } catch (error) {
      setError(error.message); // Gérer les erreurs
    }
  };

  return (
    <section className="post-container">
      {loadingPost ? (
        <p>Chargement du post...</p>
      ) : (
        <>
          {error && (
            <p className="error-message" aria-live="polite">
              {error}
            </p>
          )}
          <h1 className="post-title">{post.title}</h1>
          <div className="post-image">
            <img
              src={`http://localhost:9000/images/${post.imageUrl}`}
              alt={post.title}
            />
          </div>
          <p className="post-description">
            <span>Description: </span>
            {post.description}
          </p>
          <p className="post-date">
            {formatDate(post.publish_date).toLocaleDateString()} à{" "}
            {formatDate(post.publish_date).toLocaleTimeString()}
          </p>
          <div className="post-categories">
            <span className="post-category">{post.categoryLabel}</span>
            <div className="user-info">
              <img
                className="avatar"
                src={`/icons/${post.avatarUrl}`}
                alt={post.username}
              />
              <span className="username">
                {post.username || "Unknown User"}
              </span>
            </div>
          </div>
          <hr />
          <aside>
            <h2>Commentaires</h2>
            {loadingComments ? (
              <p>Chargement des commentaires...</p>
            ) : (
              <>
                {comments.length === 0 ? (
                  <p>
                    Aucun commentaire disponible. Soyez le premier à commenter !
                  </p>
                ) : (
                  comments.map((comment) => (
                    <Comment
                      key={comment.id}
                      comment={comment}
                      onReplySubmit={handleReplySubmit}
                      onDelete={handleDeleteComment}
                      userId={user.userId}
                    />
                  ))
                )}
                {user.isLogged && (
                  <form onSubmit={submitHandler}>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Écrire un commentaire..."
                      required
                    />
                    <button type="submit" disabled={loadingComments}>
                      Ajouter un commentaire
                    </button>
                  </form>
                )}
              </>
            )}
          </aside>
        </>
      )}
    </section>
  );
}

export default PostDetail;
