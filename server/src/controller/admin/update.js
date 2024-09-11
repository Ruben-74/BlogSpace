import Post from "../../model/Post.js";

const update_post = async (req, res) => {
  try {
    const { title, description, url, category_id, user_id } = req.body;

    // Créer un post en appelant la méthode statique du modèle Post
    const [response] = await Post.update(
      title,
      description,
      url,
      category_id,
      user_id,
      req.params.id
    );
    console.log(req.body);

    if (!response.affectedRows) {
      res.status(404).json({ msg: "Post not found" });
      return;
    }

    res
      .status(201)
      .json({ message: "Post mis a jour avec succès", id: req.body.id });
  } catch (err) {
    console.error("Erreur dans la requete maj:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export { update_post };
