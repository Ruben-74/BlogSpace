import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import formatDate from "../utils/FormatDate";
import Comment from "./Partials/Comment";
import { useSelector } from "react-redux";

function PostDetail() {
  const [post, setPost] = useState();
  const [comments, setComments] = useState([]);
  const [message, setMessage] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const userId = user.userId; // Get userId from Redux state

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté et si l'ID est disponible
    if (user.isLogged && user.userId) {
      // L'ID de l'utilisateur est prêt à être utilisé
      console.log("User ID:", user.userId);
    }
  }, [user]);

  console.log("User ID:", user.userId);

  useEffect(() => {
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

    fetchPost();
  }, [id]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/api/v1/comment/${id}`
        );
        if (!response.ok)
          throw new Error("Erreur lors de la récupération des commentaires");
        const datas = await response.json();

        const commentList = datas.map((comment) => ({
          ...comment,
          message: comment.message || "Message indisponible",
          avatar_label: comment.avatar_label || "default-avatar.png",
          replies: comment.replies || [],
        }));

        setComments(commentList);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des commentaires :",
          error
        );
        setError(error.message);
      } finally {
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user.isLogged) {
      setError("Vous devez être connecté pour commenter.");
      return;
    }

    const data = {
      message,
      user_id: userId, // Utiliser userId depuis l'état Redux
      post_id: Number(id),
      parent_id: null,
    };

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
        throw new Error(`Erreur: ${errorData.message || "Erreur inconnue"}`);
      }

      const newCommentResponse = await response.json();
      const newComment = {
        ...newCommentResponse,
        message,
        user_id: userId, // Assurez-vous que userId est défini ici
        post_id: Number(id),
        parent_id: null,
        replies: [],
        avatar_label: user.avatar || "user.png",
        username: user.username || "Utilisateur Anonyme",
        created_at: new Date().toISOString(),
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setMessage(""); // Réinitialiser le message
    } catch (error) {
      console.error("Erreur :", error);
      setError(error.message);
    }
  };

  const handleReplySubmit = async (commentId, replyMessage) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            message: replyMessage,
            user_id: userId,
            post_id: id,
            parent_id: commentId,
          }),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de l'envoi de la réponse");

      const newReply = await response.json();
      setComments((prevComments) => {
        const updatedComments = [...prevComments];
        const parentComment = updatedComments.find(
          (comment) => comment.id === commentId
        );
        if (parentComment) {
          parentComment.replies.push(newReply);
        }
        return updatedComments;
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/comment/remove/" + id,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erreur: ${errorData.message || "Erreur inconnue"}`);
      }

      // Update the state to remove the deleted comment
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
      setError(error.message);
    }
  };

  return (
    <section className="post-container">
      {loadingPost ? (
        <p>Chargement du post...</p>
      ) : (
        <>
          {error && <p className="error-message">{error}</p>}
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
                    />
                  ))
                )}
              </>
            )}

            {user.isLogged && (
              <form onSubmit={submitHandler}>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrire un commentaire..."
                  required
                />
                <button type="submit">Ajouter un commentaire</button>
              </form>
            )}
          </aside>
        </>
      )}
    </section>
  );
}

export default PostDetail;
