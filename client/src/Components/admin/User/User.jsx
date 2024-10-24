import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreateModal from "../User/Create";
import UpdateModal from "../User/Update";
import DeleteModal from "../User/Delete";

function User() {
  const [users, setUsers] = useState([]);
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null); // Reset the error state
    try {
      const response = await fetch("http://localhost:9000/api/v1/user/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users: " + response.statusText);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/user/toggle/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Erreur lors du changement de statut de l'utilisateur."
        );
      }

      fetchUsers(); // Reload user list after toggling status
    } catch (error) {
      console.error("Error toggling user status:", error);
      setError("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleDeleteClick = (user) => {
    setCurrentUser(user);
    setIsDeleteToggle(true);
  };

  const onClickDeleteUser = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:9000/api/v1/user/remove/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete user.");
      }

      fetchUsers();
      setIsDeleteToggle(false); // Close the modal after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
            <th className="status">Status</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <img
                    src={`/icons/${user.avatar_label || "user.png"}`}
                    alt={`Avatar de ${user.username}`}
                  />
                </td>
                <td className="status">
                  <button
                    className={`btn-toggle-status ${
                      user.is_active ? "active" : "inactive"
                    }`}
                    onClick={() => handleToggleActive(user.id)}
                  >
                    {user.is_active ? "Désactiver" : "Activer"}
                  </button>
                </td>
                <td>
                  <div className="button-group">
                    <button
                      className="btn-edit"
                      onClick={() => setCurrentUser(user)}
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
            ))
          ) : (
            <tr>
              <td colSpan="7">Aucun utilisateur trouvé.</td>
            </tr>
          )}
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
