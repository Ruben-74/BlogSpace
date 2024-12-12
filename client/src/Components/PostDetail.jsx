import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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

      // Si la réponse est 404, cela signifie qu'il n'y a pas de commentaires
      if (!response.ok) {
        if (response.status === 404) {
          console.warn("Aucun commentaire trouvé pour ce post.");
          setComments([]); // Aucun commentaire, donc on retourne un tableau vide
          return; // Ne pas continuer si le post n'existe pas
        }
        throw new Error("Erreur lors de la récupération des commentaires");
      }

      const datas = await response.json();

      // Si aucun commentaire n'est trouvé
      if (!datas || datas.length === 0) {
        console.warn("Aucun commentaire disponible.");
        setComments([]); // Si aucun commentaire n'est trouvé, on ne fait rien
        return;
      }

      datas.forEach((comment) => {
        if (!comment.avatar_label) {
          comment.avatar_label = "user.png";
          console.warn("Avatar manquant pour le commentaire", comment);
        }
      });

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

  const createComment = async (message, parentId = null) => {
    if (!message.trim() || !user.isLogged) {
      setError("Vous devez être connecté pour commenter.");
      return;
    }

    const data = {
      message,
      post_id: Number(id),
      parent_id: parentId,
      user_id: user.userId,
      username: user.username,
      avatarUrl: user.avatar,
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

      const newComment = await response.json();

      const commentWithAvatar = {
        ...newComment,
        avatarUrl: newComment.avatarUrl || user.avatar || "user.png",
      };

      if (parentId) {
        // Ajouter comme réponse
        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === parentId
              ? { ...comment, replies: [...comment.replies, commentWithAvatar] }
              : comment
          )
        );
      } else {
        // Ajouter comme commentaire principal
        setComments((prev) => [...prev, commentWithAvatar]);
      }

      setMessage(""); // Réinitialiser le message
    } catch (error) {
      setError(error.message);
    }
  };

  const updatedComment = async (updatedMessage, commentId) => {
    const commentData = {
      message: updatedMessage,
      status: "visible",
      post_id: Number(id),
      user_id: user.userId,
    };

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/update/${commentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(commentData),
        }
      );

      if (response.ok) {
        const updatedComment = await response.json();

        // Vérifie si `message` existe dans la réponse du serveur
        const updatedMessageValue = updatedComment?.message || updatedMessage;

        setComments((prevComments) =>
          prevComments.map((comment) =>
            comment.id === commentId
              ? { ...comment, message: updatedMessageValue }
              : comment
          )
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        await createComment(message); // Crée un commentaire principal
        await updatedComment(message);

        setMessage("");
      } catch (error) {
        console.error("Erreur :", error);
      }
    }
  };

  const handleReplySubmit = async (commentId, replyMessage) => {
    createComment(replyMessage, commentId); // Appel à createComment pour une réponse
  };

  const handleEditSubmit = async (commentId, editedMessage) => {
    updatedComment(editedMessage, commentId);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      // Envoyer la requête pour supprimer le commentaire côté serveur
      const response = await fetch(
        `http://localhost:9000/api/v1/comment/remove/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Impossible de supprimer le commentaire.");
      }

      // Mettre à jour l'état des commentaires
      setComments((prevComments) => {
        return prevComments.filter((comment) => comment.id !== commentId);
      });
    } catch (error) {
      console.error("Erreur:", error.message);
      setError("Une erreur est survenue.");
    }
  };

  return (
    <section className="post-container-detail">
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
          <div className="post-picture">
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
            {new Date(post.publish_date).toLocaleString()}
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
                      onEditSubmit={handleEditSubmit}
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
