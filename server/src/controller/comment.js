import Comment from "../model/Comment.js";
import User from "../model/User.js";

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
  const postId = req.params.id; // Assure-toi que l'ID du post est dans les paramètres de la requête

  try {
    const comments = await Comment.findAllFromPostId(postId);

    if (!comments.length) {
      return res.status(404).json({ msg: "No comments found for this post." });
    }

    res.status(200).json(comments); // Renvoie les commentaires au client
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ msg: "Failed to fetch comments." });
  }
};

// Create a new comment
const create = async (req, res) => {
  try {
    console.log("Data received:", req.body); // Pour vérifier ce qui est reçu
    const { message, post_id, parent_id } = req.body;
    const user_id = req.session.user ? req.session.user.id : null;

    // Vérification des champs requis
    if (!message || !post_id || !user_id) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    // Vérification de l'existence de l'utilisateur
    const userWithAvatar = await User.findUserWithAvatar(user_id);
    if (!userWithAvatar) {
      return res.status(400).json({ msg: "User not found." });
    }

    // Créer le commentaire
    const result = await Comment.create({
      message,
      post_id,
      parent_id: parent_id || null,
      user_id,
      username: userWithAvatar.username,
      avatar_label: userWithAvatar.avatar, // Vérifie ici que l'avatar est bien passé
    });

    // Vérifiez si le commentaire a été créé
    if (!result || !result.id) {
      return res.status(500).json({ msg: "Failed to create comment." });
    }

    res.status(201).json(result);
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
  const commentId = req.params.id;
  const userId = req.session.user ? req.session.user.id : null;
  const userRole = req.session.user ? req.session.user.role : null; // Récupère le rôle de l'utilisateur

  // Vérifie si l'utilisateur est connecté
  if (!userId) {
    return res.status(403).json({
      message: "Vous devez être connecté pour supprimer un commentaire.",
    });
  }

  try {
    // Recherche le commentaire
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    // Vérifie si l'utilisateur est un administrateur
    if (userRole === "admin") {
      // Si c'est un admin, il peut supprimer le commentaire sans vérifier la propriété
      const result = await Comment.remove(commentId);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Commentaire non trouvé." });
      }
      return res
        .status(200)
        .json({ message: "Commentaire supprimé avec succès." });
    }

    // Vérifie si le commentaire appartient à l'utilisateur
    if (comment.user_id !== userId) {
      return res.status(403).json({
        message: "Vous ne pouvez pas supprimer ce commentaire.",
      });
    }

    // Suppression du commentaire
    const result = await Comment.remove(commentId);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Commentaire non trouvé." });
    }

    res.status(200).json({ message: "Commentaire supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du commentaire :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
};

export { getAll, findAllFromID, create, update, remove };
