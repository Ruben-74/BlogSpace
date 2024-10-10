import pool from "../config/db.js";

class Post {
  static async getAll() {
    try {
      const [datas] = await pool.execute(`
        SELECT p.id AS id, p.title AS title, p.description AS description, 
               p.publish_date AS publish_date, u.username AS author, 
               i.url, c.label 
        FROM post p 
        LEFT JOIN image i ON p.id = i.post_id 
        LEFT JOIN post_category pc ON p.id = pc.post_id 
        LEFT JOIN user u ON p.user_id = u.id
        LEFT JOIN category c ON pc.category_id = c.id 
        ORDER BY p.id;
      `);
      return datas;
    } catch (err) {
      console.error("Erreur dans getAll:", err.message);
      throw new Error("Erreur lors de la récupération des posts.");
    }
  }

  static async getOneById(id) {
    try {
      const query = `
        SELECT p.id AS id, p.title AS title, p.description AS description, 
               p.publish_date AS publish_date, i.url, c.label 
        FROM post p 
        LEFT JOIN image i ON p.id = i.post_id 
        LEFT JOIN post_category pc ON p.id = pc.post_id 
        LEFT JOIN category c ON pc.category_id = c.id 
        WHERE p.id = ?;
      `;
      const [[data]] = await pool.execute(query, [id]);
      return data || null; // Renvoie null si aucune donnée n'est trouvée
    } catch (err) {
      console.error("Erreur dans getOneById:", err.message);
      throw new Error("Erreur lors de la récupération du post.");
    }
  }

  static async addImage(url, alt_img, post_id) {
    try {
      const insertQuery =
        "INSERT INTO image (url, alt_img, post_id) VALUES (?, ?, ?)";
      return await pool.execute(insertQuery, [url, alt_img, post_id]);
    } catch (err) {
      console.error("Erreur dans addImage:", err.message);
      throw new Error("Erreur lors de l'ajout de l'image.");
    }
  }

  static async create(
    title,
    description,
    imageUrl,
    alt_img,
    categoryId,
    userId
  ) {
    try {
      const postQuery = `INSERT INTO post (title, description, publish_date, user_id) VALUES (?, ?, NOW(), ?)`;
      const [postResult] = await pool.execute(postQuery, [
        title,
        description,
        userId,
      ]);

      const postId = postResult.insertId;

      // Insérer l'image si elle est fournie
      if (imageUrl) {
        await this.addImage(imageUrl, alt_img, postId);
      }

      // Insérer la catégorie associée
      const categoryQuery = `INSERT INTO post_category (post_id, category_id) VALUES (?, ?)`;
      await pool.execute(categoryQuery, [postId, categoryId]);

      return postId;
    } catch (error) {
      console.error("Erreur dans create:", error.message);
      throw new Error("Erreur lors de la création du post.");
    }
  }

  static async update(title, description, url, categoryId, id) {
    try {
      const postQuery = `UPDATE post SET title = ?, description = ?, publish_date = NOW() WHERE id = ?`;
      const imageQuery = `UPDATE image SET url = ? WHERE post_id = ?`;
      const categoryQuery = `UPDATE post_category SET category_id = ? WHERE post_id = ?;`;

      await pool.execute(postQuery, [title, description, id]);
      await pool.execute(imageQuery, [url, id]);
      await pool.execute(categoryQuery, [categoryId, id]);
    } catch (error) {
      console.error("Erreur dans update:", error.message);
      throw new Error("Erreur lors de la mise à jour du post.");
    }
  }

  static async remove(id) {
    try {
      // Suppression des images et des catégories associées
      await pool.execute("DELETE FROM image WHERE post_id = ?", [id]);
      await pool.execute("DELETE FROM post_category WHERE post_id = ?", [id]);
      return await pool.execute("DELETE FROM post WHERE id = ?", [id]);
    } catch (error) {
      console.error("Erreur dans remove:", error.message);
      throw new Error("Erreur lors de la suppression du post.");
    }
  }
}

export default Post;
