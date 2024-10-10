import React, { useContext, useEffect, useState } from "react";
import { PostContext } from "../../../store/post/PostContext";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

import CreateModal from "./Create";
import UpdateModal from "./Update";
// import DeleteModal from "./Delete";

function Post() {
  const state = useContext(PostContext);

  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  async function fetchPosts() {
    try {
      const response = await fetch("http://localhost:9000/api/v1/post/all", {
        credentials: "include", // L'option credentials doit être incluse dans un objet
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok)
        throw new Error("Erreur lors de la récupération des posts");

      const dataJSON = await response.json();
      state.listPost(dataJSON);
    } catch (error) {
      console.error(error.message); // Pour mieux gérer les erreurs
    }
  }

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

      if (!response.ok)
        throw new Error("Erreur lors de la suppression du post");

      // Mettre à jour la liste des posts après suppression
      state.listPost(state.posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <section>
      <h1>Liste des Articles</h1>
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
            <th>Author</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.posts.map((post, index) => (
            <tr key={index}>
              {/* Ensure this key is unique */}
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.label}</td>
              <td>{post.author}</td>
              <td>
                <div className="button-group">
                  <Link to={`/update/${post.id}`} className="btn-edit">
                    <FaEdit />
                  </Link>
                  <button
                    className="btn-delete"
                    aria-label={`Supprimer le post`}
                    onClick={() => handleDelete(post.id)}
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

      {isUpdateModalToggle && currentCategory && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchPost={fetchPosts}
          currentCategory={currentCategory}
        />
      )}

      {isDeleteToggle && currentCategory && (
        <DeleteModal
          onConfirm={() => onClickDeleteCategory(currentCategory.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default Post;
