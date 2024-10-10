import { useState } from "react";
import PropTypes from "prop-types";
import { FaTimes } from "react-icons/fa";

function Create({ setIsModalToggle, fetchComment }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [userId, setUserId] = useState("");

  async function submitComment(e) {
    e.preventDefault();

    const response = await fetch(
      "http://localhost:9000/api/v1/comment/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          message,
          post_id: postId, // Link the comment to a specific post
          user_id: userId, // Assign the comment to a specific user
          status,
        }),
      }
    );

    if (response.ok) {
      setMessage("");
      setUserId(""); // Clear user ID after submission
      setStatus("");
      setIsModalToggle(false);
      fetchComment();
    } else {
      // Handle error (e.g., show a message to the user)
      console.error("Failed to create comment");
    }
  }

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
        <h1>Créer un commentaire</h1>
        <form onSubmit={submitComment}>
          <label htmlFor="content">Message</label>
          <textarea
            name="content"
            id="content"
            required
            tabIndex="3"
            rows="5" // Adjust the number of rows as needed
            style={{ resize: "vertical" }} // Allows vertical resizing
          />

          <label htmlFor="status">Status</label>
          <input
            type="text"
            name="status"
            id="status"
            value={status}
            onChange={(e) => setLabel(e.target.value)}
          />
          <button className="submit-button" type="submit">
            Ajouter
          </button>
        </form>
      </aside>
    </div>
  );
}

Create.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchComment: PropTypes.func.isRequired,
};

export default Create;
