import Post from "../model/Post.js";

const create_post = async (req, res) => {
  try {
    const { title, description, categoryId, userId } = req.body; // Assurez-vous que `categoryId` est dans le corps de la requête
    const imageUrl = req.file ? `/images/${req.file.originalname}` : null;

    // Créer le post avec l'URL de l'image
    const postId = await Post.create(
      title,
      description,
      imageUrl, // Utilisez l'URL de l'image
      null, // alt_img n'est pas utilisé ici, donc on peut passer null
      categoryId, // Assurez-vous que vous passez categoryId
      userId
    );

    res.status(201).json({ message: "Post créé avec succès", postId });
  } catch (err) {
    console.error("Erreur dans create_post:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const addImage = async (req, res) => {
  try {
    const { url, alt_img, post_id } = req.body;

    // Appel à la méthode statique pour ajouter l'image
    const result = await Post.addImage(url, alt_img, post_id);
    res.status(201).json({ message: "Image ajoutée avec succès", result });
  } catch (err) {
    console.error("Erreur dans addImage:", err.message);
    res.status(500).json({ error: "Erreur lors de l'ajout de l'image." });
  }
};

const update_post = async (req, res) => {
  try {
    const { title, description, url, category_id } = req.body;

    // Créer un post en appelant la méthode statique du modèle Post
    const [response] = await Post.update(
      title,
      description,
      url,
      category_id,
      req.params.id
    );

    if (!response.affectedRows) {
      return res.status(404).json({ msg: "Post non trouvé" });
    }

    res
      .status(200)
      .json({ message: "Post mis à jour avec succès", id: req.params.id });
  } catch (err) {
    console.error("Erreur dans la requête de mise à jour:", err.message);
    res.status(500).json({ error: "Erreur lors de la mise à jour du post." });
  }
};

const delete_post = async (req, res) => {
  try {
    const [response] = await Post.remove(req.params.id);

    if (!response.affectedRows) {
      return res.status(404).json({ msg: "Post non trouvé" });
    }

    res.json({ msg: "Post supprimé", id: req.params.id });
  } catch (err) {
    console.error("Erreur dans delete_post:", err.message);
    res.status(500).json({ error: "Erreur lors de la suppression du post." });
  }
};

export { create_post, update_post, delete_post, addImage };
