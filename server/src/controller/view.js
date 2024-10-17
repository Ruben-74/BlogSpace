import Post from "../model/Post.js";

const home_view = async (req, res) => {
  try {
    const datas = await Post.getAll();
    res.json(datas);
  } catch (err) {
    console.error("Erreur dans home_view:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const post_view = async (req, res) => {
  try {
    const postData = await Post.getOneById(req.params.id);

    // Vérifier si le post existe
    if (!postData) {
      return res.status(404).json({ msg: "Post not found" }); // Réponse 404 si le post n'existe pas
    }

    // Si le post existe, envoyer les données
    res.status(200).json(postData);
  } catch (err) {
    console.error("Erreur dans post_view:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export { home_view, post_view };
