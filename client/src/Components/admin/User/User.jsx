import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreateModal from "../User/Create";
import UpdateModal from "../User/Update";
import DeleteModal from "../User/Delete";

function User() {
  const [users, setUsers] = useState(null);
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setCurrentUser(user);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setIsDeleteToggle(true);
  };

  async function onClickDeleteUser(id) {
    const response = await fetch(
      "http://localhost:9000/api/v1/user/remove/" + id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      fetchUsers();
      setIsDeleteToggle(false); // Fermer la modal après suppression
    }
  }

  if (loading) return <Loading />;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section>
      <h1>Liste des utilisateurs</h1>
      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un utilisateur
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Avatar</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <img
                  src={`/icons/${
                    user.avatar_label ? user.avatar_label : "user.png"
                  }`}
                  alt={`Avatar de ${user.username}`}
                />
              </td>
              <td>
                <div className="button-group">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(user)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClick(user)}
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
          fetchUsers={fetchUsers}
        />
      )}

      {isUpdateModalToggle && currentUser && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchUsers={fetchUsers}
          currentUser={currentUser}
        />
      )}

      {isDeleteToggle && currentUser && (
        <DeleteModal
          onConfirm={() => onClickDeleteUser(currentUser.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default User;
