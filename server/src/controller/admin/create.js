import Post from "../../model/Post.js";

const create_post = async (req, res) => {
  try {
    const { title, description, url, category_id, userId } = req.body;

    // Créer un post en appelant la méthode statique du modèle Post
    const postId = await Post.create(
      title,
      description,
      url,
      category_id,
      userId
    );

    // Répondre avec un message de succès et l'ID du post créé
    res.status(201).json({ message: "Post créé avec succès", postId });
  } catch (err) {
    // Gérer les erreurs et envoyer une réponse d'erreur
    console.error("Erreur dans create_post:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export { create_post };
