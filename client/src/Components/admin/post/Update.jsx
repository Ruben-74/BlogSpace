import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { PostContext } from "../../../store/post/PostContext";
import { FaArrowLeft, FaUpload } from "react-icons/fa";

function Update() {
  const { id } = useParams();
  const navigate = useNavigate();
  const state = useContext(PostContext);
  const [categories, setCategories] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [userId, setUserId] = useState("");
  const [image, setImage] = useState(null); // Stocke l'image en base64

  // Récupérer les catégories depuis le serveur
  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/category/all");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des catégories");
      }
      const [data] = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Récupérer les détails du post à éditer
  const updatePost = async () => {
    try {
      const response = await fetch(`http://localhost:9000/api/v1/post/${id}`);
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération du post");
      }
      const post = await response.json();
      console.log(post);
      setTitle(post.title);
      setDescription(post.description);
      setCategoryId(post.category_id);
      setUserId(post.userId);
      setImage(post.url); // Initialiser avec l'image actuelle
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    updatePost();
  }, [id]);

  // Gérer la sélection de fichier et la conversion en base64
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5 Mo
      if (file.size > maxSize) {
        alert(
          "La taille du fichier est trop grande. Veuillez choisir un fichier de moins de 5 Mo."
        );
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // URL base64 de l'image
      };
      reader.readAsDataURL(file); // Lire le fichier comme Data URL (base64)
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedPost = {
      id: parseInt(id),
      title,
      description,
      category_id: categoryId,
      url: image, // Utiliser l'image en base64
      userId,
    };

    try {
      await state.updatePost(updatedPost);
      navigate("/list");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du post:", error);
    }
  };

  return (
    <section className="container">
      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="back-button-container">
          <Link to="/list" className="back-button">
            <FaArrowLeft />
          </Link>
          <h2>Modifier votre Post</h2>
        </div>
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
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </label>
        <label className="file-upload-label">
          <span className="upload-button">
            <FaUpload /> Changez l'image
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </label>
        {image && (
          <div className="image-preview">
            <img
              src={image}
              alt="Aperçu de l'image"
              style={{ maxWidth: "200px" }}
            />
          </div>
        )}
        <button type="submit" className="submit-button">
          Mettre à jour
        </button>
      </form>
    </section>
  );
}

export default Update;
