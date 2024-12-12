import PropTypes from "prop-types";
import Report from "../Partials/Report";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { IoEllipsisVertical } from "react-icons/io5";
import { IoFlagOutline } from "react-icons/io5";
import { useSelector } from "react-redux";

function Comment({ comment, onReplySubmit, onEditSubmit, onDelete, userId }) {
  // États pour gérer l'affichage des réponses, édition et erreurs
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [editMessage, setEditMessage] = useState("");
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReporting, setIsReporting] = useState(false);

  // Récupération des informations utilisateur depuis Redux
  const user = useSelector((state) => state.user);

  /** Fonction pour soumettre une réponse */
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

  /** Fonction pour soumettre une modification du commentaire */
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedComment = await onEditSubmit(comment.id, editMessage);

      // Mettre à jour l'état local pour réafficher les changements
      setEditMessage("");
      setIsEditing(false);

      // Mettre à jour l'interface avec le nouveau message
      comment.message = updatedComment.message;
    } catch (err) {
      setError("Échec de la modification du commentaire.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Fonction pour supprimer un commentaire */
  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      onDelete(comment.id);
    }
  };

  /** Fonction pour ouvrir/fermer le menu des actions */
  const handleMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;
  const isUserComment = Number(comment.user_id) === user.userId;
  const isLoggedIn = user.userId !== null;

  return (
    <div className="comment">
      {/* En-tête du commentaire */}
      <div className="comment-header">
        <img
          src={
            comment.avatarUrl
              ? `/icons/${comment.avatarUrl}`
              : "/icons/user.png"
          }
          alt={`${comment.username}'s avatar`}
          className="comment-avatar"
        />
        <div className="comment-info">
          <h4 className="comment-user">{comment.username}</h4>
          <p className="comment-date">
            {new Date(comment.created_at).toLocaleString()}
          </p>
        </div>

        {/* Menu des actions pour les autres utilisateurs */}
        {!isUserComment && isLoggedIn && (
          <div className="menu-button" onClick={handleMenuToggle}>
            <IoEllipsisVertical size={20} />
          </div>
        )}

        {/* Bouton pour supprimer le commentaire pour le propriétaire du commentaire */}
        {isUserComment && (
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

      {isMenuOpen && (
        <div className="dropdown-menu">
          <IoFlagOutline size={20} />
          <button onClick={() => setIsReporting(true)}>Signaler</button>
        </div>
      )}

      {isReporting && (
        <Report
          isOpen={isReporting}
          onClose={() => setIsReporting(false)}
          commentId={comment.id}
        />
      )}

      {hasReplies && (
        <div className="replies">
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onReplySubmit={onReplySubmit}
              onEditSubmit={onEditSubmit}
              onDelete={onDelete}
              userId={userId}
            />
          ))}
        </div>
      )}

      {/* Interface pour ajouter une réponse */}
      {isReplying ? (
        <form onSubmit={handleReplySubmit} className="reply-form">
          <textarea
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            placeholder="Écrire votre réponse..."
            required
          />
          <div className="buttons-action">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Envoi..." : "Envoyer"}
            </button>
            <button type="button" onClick={() => setIsReplying(false)}>
              Annuler
            </button>
          </div>
        </form>
      ) : isEditing ? (
        <form onSubmit={handleEditSubmit} className="reply-form">
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            placeholder="Modifier votre commentaire..."
            required
          />
          <div className="buttons-action">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Modifier..." : "Enregistrer"}
            </button>
            <button type="button" onClick={() => setIsEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="buttons-action">
          {!isUserComment &&
            isLoggedIn &&
            (!comment.replies || comment.replies.length === 0) && (
              <button
                type="button"
                className="reply-button"
                onClick={() => setIsReplying(true)}
              >
                Répondre
              </button>
            )}
          {isUserComment && (
            <button
              type="button"
              className="reply-button"
              onClick={() => setIsEditing(true)}
            >
              Modifier
            </button>
          )}
        </div>
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
    avatar_label: PropTypes.string,
    username: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
  onReplySubmit: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  userId: PropTypes.number.isRequired,
};

export default Comment;
