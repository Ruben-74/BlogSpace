import React, { useContext, useEffect, useState, useCallback } from "react";
import { PostContext } from "../../../store/post/PostContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import CreateModal from "./Create";
import UpdateModal from "./Update";
import DeleteModal from "./Delete";

function Post() {
  const state = useContext(PostContext);

  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [error, setError] = useState(""); // Pour gérer les erreurs

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:9000/api/v1/post/all", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des posts");

      const dataJSON = await response.json();
      state.listPost(dataJSON);
      setError(""); // Réinitialiser l'erreur
    } catch (error) {
      console.error(error.message);
      setError(error.message); // Mettre à jour l'état d'erreur
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/post/remove/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (response.ok) {
        fetchPosts();
        setIsDeleteToggle(false);
      } else {
        throw new Error("Erreur lors de la suppression du post.");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setError(error.message);
    }
  };

  const handleEditClick = (post) => {
    setCurrentPost(post);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (post) => {
    setCurrentPost(post);
    setIsDeleteToggle(true);
  };

  return (
    <section>
      <h1>Liste des Articles</h1>
      {error && <p className="error-message">{error}</p>}{" "}
      {/* Affichage des erreurs */}
      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un article
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Titre</th>
            <th>Catégorie</th>
            <th>Auteur</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.posts.map((post, index) => (
            <tr key={index}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.label}</td>
              <td>{post.author}</td>
              <td>
                <div className="button-group">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(post)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClick(post)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isCreateModalToggle && (
        <CreateModal
          setIsModalToggle={setIsCreateModalToggle}
          fetchPost={fetchPosts}
        />
      )}
      {isUpdateModalToggle && currentPost && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchPost={fetchPosts}
          currentPost={currentPost}
        />
      )}
      {isDeleteToggle && currentPost && (
        <DeleteModal
          onConfirm={() => handleDelete(currentPost.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default Post;
