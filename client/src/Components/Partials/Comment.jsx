import PropTypes from "prop-types";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";

function Comment({ comment, onReplySubmit, onDelete }) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for replies

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (replyMessage.trim()) {
      setIsSubmitting(true); // Start loading
      try {
        await onReplySubmit(comment.id, replyMessage);
        setReplyMessage("");
        setIsReplying(false);
        setError(null);
      } catch (err) {
        setError("Échec de l'envoi de la réponse.");
      } finally {
        setIsSubmitting(false); // Stop loading
      }
    }
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      onDelete(comment.id);
    }
  };

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
        <button
          type="button"
          className="delete-button"
          onClick={handleDelete}
          aria-label="Delete comment"
        >
          <IoMdClose size={20} />
        </button>
      </div>
      <p className="comment-message">
        {comment.message || "Message indisponible"}
      </p>

      {comment.replies && comment.replies.length > 0 && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              onDelete={onDelete} // Pass the onDelete function to replies as well
            />
          ))}
        </div>
      )}

      <button
        type="button"
        className="reply-button"
        onClick={() => setIsReplying((prev) => !prev)}
      >
        {isReplying ? "Annuler" : "Répondre"}
      </button>

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
    message: PropTypes.string.isRequired,
    user_id: PropTypes.number.isRequired,
    post_id: PropTypes.number.isRequired,
    parent_id: PropTypes.number,
    replies: PropTypes.array,
    avatar_label: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired, // New prop for delete function
};

export default Comment;
