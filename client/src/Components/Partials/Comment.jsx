import PropTypes from "prop-types";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

function Comment({ comment, onReplySubmit, onDelete, userId }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state) => state.user);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (replyMessage.trim()) {
      setIsSubmitting(true);
      try {
        await onReplySubmit(comment.id, replyMessage);
        setReplyMessage("");
        setIsReplying(false);
        setError(null);
      } catch (err) {
        setError("Échec de l'envoi de la réponse.");
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError("Le message ne peut pas être vide.");
    }
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      onDelete(comment.id);
    }
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  console.log("userId:", userId);
  console.log("comment.user_id:", comment.user_id);

  return (
    <div className="comment">
      <div className="comment-header">
        <img
          src={`/icons/${comment.avatar_label}`}
          alt={`${comment.username}'s avatar`}
          className="comment-avatar"
        />
        <div className="comment-info">
          <h4 className="comment-user">{comment.username}</h4>
          <p className="comment-date">
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>

        {Number(comment.user_id) === user.userId && ( // Vérifie si le commentaire appartient à l'utilisateur
          <button
            type="button"
            className="delete-button"
            onClick={handleDelete}
            aria-label="Supprimer le commentaire"
          >
            <IoMdClose size={20} />
          </button>
        )}
      </div>
      <p className="comment-message">
        {comment.message || "Message indisponible"}
      </p>

      {hasReplies && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              onDelete={onDelete}
              userId={userId}
            />
          ))}
        </div>
      )}

      {!hasReplies && (
        <button
          type="button"
          className="reply-button"
          onClick={() => setIsReplying((prev) => !prev)}
          aria-expanded={isReplying}
        >
          {isReplying ? "Annuler" : "Répondre"}
        </button>
      )}

      {isReplying && (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Écrire votre réponse..."
            required
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Envoi..." : "Envoyer"}
          </button>
        </form>
      )}
    </div>
  );
}

Comment.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    parent_id: PropTypes.number,
    replies: PropTypes.array,
    avatar_label: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default Comment;
