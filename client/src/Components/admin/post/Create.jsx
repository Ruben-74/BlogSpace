import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FaTimes, FaUpload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { PostContext } from "../../../store/post/PostContext";

function Create({ setIsModalToggle, fetchPost }) {
  const state = useContext(PostContext);
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");

  const userId = useSelector((state) => state.user.userId);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/api/v1/category/list"
      );
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Erreur lors de la récupération des catégories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez télécharger un fichier image valide.");
        setImage(null);
        return;
      }
      setImage(file);
      setError(""); // Réinitialiser l'erreur si le fichier est valide
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      setError("Veuillez sélectionner une image à télécharger.");
      return;
    }

    const postData = new FormData();
    postData.append("title", title);
    postData.append("description", description);
    postData.append("categoryId", categoryId); // Assurez-vous que c'est le bon nom
    postData.append("userId", userId);
    if (image) {
      postData.append("image", image);
    }

    try {
      await state.createPost(postData);
      // Réinitialisez les états
      setTitle("");
      setDescription("");
      setCategoryId("");
      setImage(null);
      fetchPost(""); // Récupérer les posts mis à jour
      navigate("/post"); // Rediriger après la création
    } catch (err) {
      console.error("Erreur lors de la création du post:", err);
      setError("Erreur lors de la création du post. Veuillez réessayer.");
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
        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="back-button-container">
            <h2>Créer votre Post</h2>
          </div>
          {error && <p className="error-message">{error}</p>}
          <label>
            Titre:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>
          <label>
            Catégorie:
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Aucune catégorie disponible
                </option>
              )}
            </select>
          </label>
          <label className="file-upload-label">
            <span className="upload-button">
              <FaUpload /> Téléchargez l'image
            </span>
            <input
              type="file"
              className="file-input"
              onChange={handleImageChange}
              required // Assurez-vous qu'un fichier est requis
            />
          </label>
          {image && (
            <div className="image-preview">
              <img
                src={URL.createObjectURL(image)}
                alt="Aperçu de l'image"
                style={{ maxWidth: "200px" }}
              />
            </div>
          )}
          <button type="submit" className="submit-button">
            Poster
          </button>
        </form>
      </aside>
    </div>
  );
}

Create.propTypes = {
  setIsModalToggle: PropTypes.func.isRequired,
  fetchPost: PropTypes.func.isRequired,
};

export default Create;
