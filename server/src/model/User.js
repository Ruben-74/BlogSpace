import pool from "../config/db.js";

import bcrypt from "bcrypt";

class User {
  static async findAll() {
    const SELECT_ALL = `
      SELECT u.*, a.label AS avatar_label
      FROM user u
      LEFT JOIN avatar a ON u.avatar_id = a.id
    `;
    return await pool.query(SELECT_ALL);
  }

  static async findUserWithAvatar(id) {
    const FIND_ONE = `
    SELECT u.id, u.username, a.label AS avatar
    FROM user u
    LEFT JOIN avatar a ON u.avatar_id = a.id
    WHERE u.id = ?`;
    try {
      const [results] = await pool.execute(FIND_ONE, [id]);
      return results;
    } catch (error) {
      console.error("Error finding user:", error);
      throw new Error("Database error while finding user");
    }
  }

  static async create(username, email, password, role = "admin", avatarID) {
    // Validate inputs
    if (!username || !email || !password) {
      throw new Error("Missing required fields: username, email, or password");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const INSERT =
      "INSERT INTO user (username, email, password, role, avatar_id) VALUES (?, ?, ?, ?, ?)";

    try {
      return await pool.execute(INSERT, [
        username,
        email,
        hashedPassword,
        role,
        avatarID || null,
      ]);
    } catch (error) {
      throw new Error("Database error: " + error.message);
    }
  }

  static async update(username, email, password, avatarId, id) {
    // Check required fields
    if (!username || !email || !id) {
      throw new Error("Missing required fields: username, email, or id");
    }

    // Prepare the base update query
    let UPDATE =
      "UPDATE user SET username = ?, email = ?,  avatar_id = ? WHERE id = ?";

    // If a new password is provided, hash it and adjust the query
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      UPDATE =
        "UPDATE user SET username = ?, email = ?, password = ?, avatar_id = ? WHERE id = ?";
      return await pool.execute(UPDATE, [
        username,
        email,
        hashedPassword,
        avatarId,
        id,
      ]);
    }

    // Execute the query without password
    return await pool.execute(UPDATE, [username, email, avatarId || null, id]);
  }

  static async remove(id) {
    const REMOVE = "DELETE FROM user WHERE id = ?";
    return await pool.execute(REMOVE, [id]);
  }

  static async updateAvatar(avatar, id) {
    const UPDATE_AVATAR = "UPDATE user SET avatar_id = ? WHERE id = ?";
    const [result] = await pool.execute(UPDATE_AVATAR, [avatar, id]); // Assure-toi que 'result' est un tableau
    return result; // Retourne le résultat directement
  }
}

export default User;
