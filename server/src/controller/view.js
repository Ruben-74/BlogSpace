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
    // Requête SQL pour récupérer le post correspondant
    const data = await Post.getOneById(req.params.id);
    res.json(data);

    // Vérifier si le post existe
    if (data.length === 0) {
      return res.status(404).json({ msg: "Post not found" }); // Réponse 404 si le post n'existe pas
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { home_view, post_view };
