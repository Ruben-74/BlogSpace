import pool from "../config/db.js";

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
    SELECT comment.*, user.username, avatar.label AS avatar_label
    FROM comment 
    JOIN user ON comment.user_id = user.id 
    JOIN avatar ON user.avatar_id = avatar.id 
    WHERE post_id = ?`;

    const [results] = await pool.execute(SELECT_COMMENTS, [postId]);
    return results;
  }

  static async findById(id) {
    const SELECT_ONE = "SELECT * FROM comment WHERE id = ?";
    return await pool.execute(SELECT_ONE, [id]);
  }

  static async create(datas) {
    const INSERT =
      "INSERT INTO comment (message, post_id, user_id, parent_id) VALUES (?, ?, ?, null)";
    try {
      const [result] = await pool.execute(INSERT, [
        datas.message,
        datas.post_id,
        datas.user_id,
      ]);
      return { id: result.insertId, ...datas }; // Return the created comment ID and data
    } catch (error) {
      console.error("Error creating comment:", error);
      throw new Error("Database error while creating comment");
    }
  }

  static async update({ message, status, post_id, user_id, id }) {
    const UPDATE =
      "UPDATE comment SET message = ?, status = ?, post_id = ?, user_id = ? WHERE id = ?";

    // Assurez-vous que tous les champs sont définis
    const values = [message, status, post_id, user_id, id];

    return await pool.execute(UPDATE, values);
  }
  static async remove(id) {
    const DELETE = "DELETE FROM comment WHERE id = ?";
    return await pool.execute(DELETE, [id]);
  }
}

export default Comment;
