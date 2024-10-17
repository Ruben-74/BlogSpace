import React, { useEffect, useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import UpdateModal from "./MessageDetail";
import DeleteModal from "./Delete";

function Contact() {
  const [contacts, setContacts] = useState([]);
  const [isUpdateModalToggle, setIsUpdateModalToggle] = useState(false);
  const [isDeleteToggle, setIsDeleteToggle] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(null);

  const fetchContact = async () => {
    const response = await fetch("http://localhost:9000/api/v1/contact/all", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Erreur lors de la récupération des contacts");
      return;
    }

    const data = await response.json();
    setContacts(data);
    console.log(data);
  };

  useEffect(() => {
    fetchContact();
  }, []);

  const renderStatus = (status) => {
    const statusText =
      status === "Message non lu" ? "Message non lu" : "Message déjà lu";
    return (
      <span
        className={
          status === "Message non lu" ? "status-unread" : "status-read"
        }
      >
        {statusText}
      </span>
    );
  };

  const handleEditClick = async (contact) => {
    const updatedContact = { ...contact, status: 1 };

    const response = await fetch(
      `http://localhost:9000/api/v1/contact/update/${contact.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: 1 }),
        credentials: "include",
      }
    );

    if (response.ok) {
      setContacts((prevContacts) =>
        prevContacts.map((c) => (c.id === contact.id ? updatedContact : c))
      );
      setCurrentMessage(updatedContact);
      setIsUpdateModalToggle(true);
    } else {
      console.error("Erreur lors de la mise à jour du statut");
      await fetchContact(); // Refetch if the update failed
    }
  };

  const handleDeleteClick = (contact) => {
    setCurrentMessage(contact);
    setIsDeleteToggle(true);
  };

  const onClickDelete = async (id) => {
    const response = await fetch(
      `http://localhost:9000/api/v1/contact/remove/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      setContacts((prevContacts) => prevContacts.filter((c) => c.id !== id));
      setIsDeleteToggle(false);
    } else {
      console.error("Erreur lors de la suppression du contact");
    }
  };

  return (
    <section>
      <h1>Messagerie</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Content</th>
            <th>Status</th>
            <th>Date de Publication</th>
            <th className="buttons">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.id}</td>
              <td>{contact.username}</td>
              <td>{contact.email}</td>
              <td>{contact.content}</td>
              <td>{renderStatus(contact.status)}</td>
              <td>{new Date(contact.publish_date).toLocaleString("fr-FR")}</td>
              <td>
                <div className="button-group">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditClick(contact)}
                  >
                    <FaEye />
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteClick(contact)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isUpdateModalToggle && currentMessage && (
        <UpdateModal
          setIsModalToggle={setIsUpdateModalToggle}
          fetchContact={fetchContact}
          currentMessage={currentMessage}
        />
      )}

      {isDeleteToggle && currentMessage && (
        <DeleteModal
          onConfirm={() => onClickDelete(currentMessage.id)}
          onClose={() => setIsDeleteToggle(false)}
        />
      )}
    </section>
  );
}

export default Contact;
