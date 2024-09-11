import pool from "../config/db.js";

class Post {
  static async getAll() {
    try {
      const [datas] = await pool.execute(` 
      SELECT p.id AS id, p.title AS title, p.description AS description, i.url, c.label 
      FROM post p 
      LEFT JOIN image i ON p.id = i.post_id 
      LEFT JOIN post_category pc ON p.id = pc.post_id 
      LEFT JOIN category c ON pc.category_id = c.id 
      ORDER BY p.id;
     `);
      return datas;
    } catch (err) {
      console.error("Erreur dans getAll:", err.message);
      throw err;
    }
  }

  static async getOneById(id) {
    const q = `
   SELECT p.id AS id, p.title AS title, p.description AS description, p.publish_date AS publish_date, i.url, c.label 
   FROM post p 
   JOIN image i ON p.id = i.post_id 
   JOIN post_category pc ON p.id = pc.post_id 
   JOIN category c ON pc.category_id = c.id 
   WHERE p.id = ?
   ORDER BY p.id`;
    const [[data]] = await pool.execute(q, [id]);
    console.log(data);
    return data;
  }

  static async create(title, description, url, categoryId, userId) {
    try {
      const postQuery = `INSERT INTO post (title, description, publish_date, user_id) VALUES (?, ?, NOW(), ?)`;
      const imageQuery = `INSERT INTO image (url, post_id) VALUES (?, ?)`;
      const categoryQuery = `INSERT INTO post_category (post_id, category_id) VALUES (?, ?)`;

      const [postId] = await pool.execute(postQuery, [
        title,
        description,
        userId,
      ]);

      await pool.execute(imageQuery, [url, postId.insertId]);

      await pool.execute(categoryQuery, [postId.insertId, categoryId]);

      return postId.insertId;
    } catch (error) {
      console.log(error);
    }
  }

  static async update(title, description, url, categoryId, user_id, id) {
    try {
      const postQuery = `UPDATE post SET title = ?, description = ?, publish_date = NOW(), user_id = ? WHERE id = ?`;
      const imageQuery = `UPDATE image SET url = ? WHERE post_id = ?`;
      const categoryQuery = `UPDATE post_category SET category_id = ? WHERE post_id = ?;`;

      await pool.execute(postQuery, [title, description, user_id, id]);

      await pool.execute(imageQuery, [url, id]);

      await pool.execute(categoryQuery, [categoryId, id]);
    } catch (error) {
      console.log("dded", error);
    }
  }

  // static async remove(id) {
  //   //on supprime d'abord la clé étrangere de la table post_category pour permettre de supprimer celle de la table categorie
  //   const post_category = "DELETE FROM post_category WHERE category_id = ?";
  //   const category = "DELETE FROM category WHERE id = ?";
  //   await pool.execute(post_category, [id]);
  //   return await pool.execute(category, [id]);
  // }
}

export default Post;
