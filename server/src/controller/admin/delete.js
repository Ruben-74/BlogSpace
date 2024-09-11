import pool from "../../config/db.js";

const delete_post = async (req, res) => {
  const postId = parseInt(req.params.id, 10);

  try {
    //On supprime d'abord la clé étrangère de qui se trouve dans la table post_category
    const queryPostCategory = "DELETE FROM post_category WHERE id_post = ?";

    const resultPostCategory = await pool.execute(queryPostCategory, [postId]);

    //Maintenant on peut supprimer le post
    const queryDelete = "DELETE FROM post WHERE id = ?";

    const resultdeletePost = await pool.execute(queryDelete, [postId]);

    res.status(201).json({ msg: "Suppression du post avec succés" });
  } catch (error) {
    res.status(500).json({ msg: "Erreur de la supression du post", error });
  }
};

export { delete_post };
