import Comment from "../model/Comment.js";

const sendResponse = (res, status, data) => {
  res.status(status).json(data);
};

const getAll = async (req, res) => {
  try {
    const [comments] = await Comment.findAll();
    sendResponse(res, 200, comments);
  } catch (err) {
    sendResponse(res, 500, { msg: err.message });
  }
};

const findAllFromID = async (req, res) => {
  try {
    const { id } = req.params;
    const comments = await Comment.findAllFromPostId(id);

    console.log("Fetched comments:", comments);

    // Vérifiez si des commentaires existent

    if (!comments || comments.length === 0) {
      return res.status(200).json([]); // Renvoie un tableau vide
    }

    res.status(200).json(comments);
  } catch (err) {
    console.error("Erreur dans findAllFromID:", err.message);
    res.status(500).json({
      msg: "Une erreur est survenue lors de la récupération des commentaires.",
    });
  }
};

// Create a new comment
const create = async (req, res) => {
  try {
    const { message, post_id, user_id } = req.body; // Récupérer les champs du corps de la requête

    console.log("Comment ", req.body);

    // Vérification des champs requis
    if (!message || !post_id || !user_id) {
      return res
        .status(400)
        .json({ msg: "Missing required fields: message, post_id, or user_id" });
    }

    // Créer le commentaire
    const result = await Comment.create({ message, post_id, user_id });
    console.log("Comment created:", result);

    // Assure-toi que result a bien un id avant de l'utiliser
    res
      .status(201)
      .json({ msg: "Comment created", id: result.id || result.insertId });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ msg: "Database error while creating comment" });
  }
};

// Update an existing comment
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { message, status, post_id, user_id } = req.body;

    // Vérification des champs requis
    if (!message || !post_id || !user_id || status === undefined) {
      return res
        .status(400)
        .json({ msg: "Tous les champs doivent être remplis." });
    }

    // Appel à la méthode de mise à jour
    await Comment.update({
      message,
      status,
      post_id: post_id, // Assurez-vous que post_id est un nombre
      user_id: user_id, // Assurez-vous que user_id est un nombre
      id,
    });

    res.status(200).json({ msg: "Commentaire mis à jour" });
  } catch (err) {
    console.error("Erreur lors de la mise à jour du commentaire :", err);
    res.status(500).json({ msg: err.message });
  }
};

// Remove a comment
const remove = async (req, res) => {
  try {
    const [response] = await Comment.remove(req.params.id);

    if (!response.affectedRows) {
      res.status(404).json({ msg: "Comment not found" });
      return;
    }

    res.json({ msg: "Comment deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { getAll, findAllFromID, create, update, remove };
