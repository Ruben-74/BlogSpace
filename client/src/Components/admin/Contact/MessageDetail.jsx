import React, { useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaEnvelope } from "react-icons/fa";

function CommentModal({ setIsModalToggle, currentMessage }) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submitComment = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(""); // Reset error message on new submission

    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/contact/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: currentMessage.email,
            subject: `Réponse à votre message`,
            content: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du commentaire.");
      }

      alert("Commentaire envoyé avec succès !");
      setMessage(""); // Reset message field
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du commentaire. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <aside className="modal-form active">
        <button
          className="close-button"
          onClick={() => setIsModalToggle(false)}
          aria-label="Fermer la modal"
        >
          <FaTimes />
        </button>

        <h2>Détails du Message</h2>
        <table className="message-details-table">
          <tbody>
            <tr>
              <th>ID</th>
              <td>{currentMessage.id}</td>
            </tr>
            <tr>
              <th>Nom d'utilisateur</th>
              <td>{currentMessage.username}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{currentMessage.email}</td>
            </tr>
            <tr>
              <th>Contenu</th>
              <td>{currentMessage.content}</td>
            </tr>
            <tr>
              <th>Status</th>
              <td>{currentMessage.status}</td>
            </tr>
            <tr>
              <th>Date de Publication</th>
              <td>{new Date(currentMessage.publish_date).toLocaleString()}</td>
            </tr>
          </tbody>
        </table>

        <h2>Répondre au message</h2>
        <form onSubmit={submitComment}>
          <label htmlFor="message">Message</label>
          <textarea
            name="message"
            id="message"
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            style={{ resize: "vertical" }}
          />
          <button type="submit" className="reply-button" disabled={isLoading}>
            <FaEnvelope size={15} /> {isLoading ? "Envoi..." : "Répondre"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </aside>
    </div>
  );
}

CommentModal.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  currentMessage: PropTypes.object.isRequired,
};

export default CommentModal;
