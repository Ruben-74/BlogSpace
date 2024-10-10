import pool from "../config/db.js";

class Auth {
  static async create(datas) {
    // Insert username along with email and password
    const INSERT =
      "INSERT INTO user (username, email, password) VALUES (?, ?, ?)";
    return await pool.execute(INSERT, [...Object.values(datas)]);
  }

  static async findOneByEmail(email) {
    // Include username in the SELECT query
    const SELECT = "SELECT id, email, password FROM user WHERE email = ?";
    return await pool.execute(SELECT, [email]);
  }

  static async findUserInfoById(id) {
    const SELECT =
      "SELECT username, role, label AS avatar FROM user LEFT JOIN avatar ON user.avatar_id = avatar.id WHERE user.id = ?";
    return await pool.execute(SELECT, [id]);
  }
}

export default Auth;
