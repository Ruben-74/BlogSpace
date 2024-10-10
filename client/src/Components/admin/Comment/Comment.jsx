import { useEffect, useState } from "react";
import Loading from "../../Loading";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import CreateModal from "../Comment/Create";
import UpdateModal from "../Comment/Update";
// import DeleteModal from "../Comment/Delete";

function User() {
  const [comments, setComments] = useState(null);
  const [isCreateModalToggle, setIsCreateModalToggle] = useState(false);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentComment, setCurrentComment] = useState(null);

  const fetchComment = async () => {
    const response = await fetch("http://localhost:9000/api/v1/comment/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    setComments(data);
  };

  useEffect(() => {
    fetchComment();
  }, []);

  const handleEditClick = (comment) => {
    setCurrentComment(comment);
    setIsUpdateModalToggle(true);
  };

  const handleDeleteClick = (comment) => {
    setCurrentComment(comment);
    setIsDeleteToggle(true); // Ouvrir la modal de confirmation
  };

  if (!comments) return <Loading />;

  return (
    <section>
      <h1>Liste des commentaires</h1>
      <div className="container-list">
        <button
          className="btn-create"
          onClick={() => setIsCreateModalToggle(!isCreateModalToggle)}
        >
          <FaPlus />
          Ajouter un commentaire
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Message</th>
            <th>Date de publication</th>
            <th>Status</th>
            <th>Post_id</th>
            <th>User_id</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td>{comment.id}</td>
              <td>{comment.message}</td>
              <td>{new Date(comment.created_at).toLocaleString()}</td>
              <td>{comment.status}</td>
              <td>{comment.post_id}</td>
              <td>{comment.user_id}</td>
              <td>
                <div className="button-group">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(comment)}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClick(comment)}
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
          fetchComment={fetchComment}
        />
      )}

      {isUpdateModalToggle && currentCategory && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchComment={fetchComment}
          currentComment={currentComment}
        />
      )}

      {isDeleteToggle && currentComment && (
        <DeleteModal
          onConfirm={() => onClickDeleteComment(currentComment.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default User;
