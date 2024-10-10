import React, { useEffect, useState } from "react";
import Loading from "../../Loading";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreateModal from "./Create";
import UpdateModal from "./Update";
import DeleteModal from "./Delete";

function Category() {
  const [categories, setCategories] = useState(null);
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  async function fetchCategories() {
    const response = await fetch("http://localhost:9000/api/v1/category/list", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    setCategories(data);
  }

  async function onClickDeleteCategory(id) {
    const response = await fetch(
      "http://localhost:9000/api/v1/category/remove/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      fetchCategories();
      setIsDeleteToggle(false); // Fermer la modal après suppression
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  if (!categories) return <Loading />;

  const handleEditClick = (category) => {
    setCurrentCategory(category);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (category) => {
    setCurrentCategory(category);
    setIsDeleteToggle(true); // Ouvrir la modal de confirmation
  };

  return (
    <section>
      <h1>Liste des catégories</h1>
      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter une catégorie
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Label</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.label}</td>
              <td>
                <div className="button-group">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(category)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClick(category)}
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
          fetchCategories={fetchCategories}
        />
      )}

      {isUpdateModalToggle && currentCategory && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchCategories={fetchCategories}
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

export default Category;
