import pool from "../config/db.js";
import User from "./User.js";

class Comment {
  static async findAll() {
    const SELECT_ALL = `
    SELECT 
      c.*,              
      u.username, 
      p.title 
    FROM 
      comment c
    JOIN 
      post p ON c.post_id = p.id
    JOIN 
      user u ON c.user_id = u.id
  `;

    return await pool.execute(SELECT_ALL);
  }

  static async findAllFromPostId(postId) {
    const SELECT_COMMENTS = `
   SELECT c.id, c.message, c.created_at, c.user_id, c.parent_id,
       u.username, a.label AS avatar_label
    FROM comment c
    LEFT JOIN user u ON c.user_id = u.id
    LEFT JOIN avatar a ON u.avatar_id = a.id
    WHERE c.post_id = ?`;

    const [results] = await pool.execute(SELECT_COMMENTS, [postId]);
    return results;
  }

  static async findById(id) {
    const SELECT_ONE = "SELECT * FROM comment WHERE id = ?";
    try {
      const [rows] = await pool.execute(SELECT_ONE, [id]);
      return rows.length > 0 ? rows[0] : null; // Retourne le premier commentaire ou null si aucun n'est trouvé
    } catch (error) {
      console.error("Error fetching comment by ID:", error);
      throw new Error("Database error while fetching comment");
    }
  }

  // Dans ton endpoint API qui crée un commentaire
  static async create(data) {
    const INSERT = `
      INSERT INTO comment (message, user_id, post_id, parent_id)
      VALUES (?, ?, ?, ?)`;

    const { message, post_id, parent_id, user_id, username, avatar_label } =
      data; // Vérifie que tu reçois bien les bons champs

    try {
      if (!message || !post_id || !user_id) {
        throw new Error("Missing required fields.");
      }

      if (message.length < 1 || message.length > 500) {
        throw new Error("Message must be between 1 and 500 characters.");
      }

      const [result] = await pool.execute(INSERT, [
        message,
        user_id,
        post_id,
        parent_id,
      ]);

      if (!result || !result.insertId) {
        throw new Error("Failed to create comment.");
      }

      // Assurez-vous de renvoyer l'avatar_label correct
      return {
        id: result.insertId,
        message,
        post_id,
        parent_id,
        user_id,
        username: username || "Unknown User",
        avatar_label: avatar_label || "user.png", // Utilisez avatar_label ici
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error creating comment:", error.message);
      throw new Error(error.message);
    }
  }

  static async update({ message, status, post_id, user_id, id }) {
    const UPDATE =
      "UPDATE comment SET message = ?, status = ?, post_id = ?, user_id = ? WHERE id = ?";

    // Assurez-vous que tous les champs sont définis
    const values = [message, status, post_id, user_id, id];

    return await pool.execute(UPDATE, values);
  }

  static async remove(commentId) {
    const DELETE_REPLIES = "DELETE FROM comment WHERE parent_id = ?"; // Supprime toutes les réponses
    const DELETE_COMMENT = "DELETE FROM comment WHERE id = ?"; // Supprime le commentaire principal

    try {
      // Supprime d'abord toutes les réponses
      await pool.execute(DELETE_REPLIES, [commentId]);

      // Ensuite, supprime le commentaire principal
      const [result] = await pool.execute(DELETE_COMMENT, [commentId]);
      return result; // Renvoie le résultat de la suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du commentaire :", error);
      throw new Error("Database error while deleting comment");
    }
  }
}

export default Comment;
