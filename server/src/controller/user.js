import User from "../model/User.js";

const getAll = async (req, res) => {
  const [users] = await User.findAll();
  console.log(users);
  res.json(users);
};

const create_user = async (req, res) => {
  try {
    const { username, email, password, avatarId } = req.body;

    // Si l'avatar n'est pas fourni, vous pouvez le définir sur null
    const [response] = await User.create(
      username,
      email,
      password,
      "admin",
      avatarId || null
    );

    res.json({ msg: "Utilisateur créé", id: response.insertId });
  } catch (err) {
    console.error("Erreur lors de la création de l'utilisateur:", err);
    res.status(500).json({ msg: "Erreur serveur, veuillez réessayer." });
  }
};

const update_user = async (req, res) => {
  try {
    const { username, email, password, avatarId } = req.body;

    // Ensure all required fields are present
    if (!username || !email || !req.params.id) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    // Update the user
    const [response] = await User.update(
      username,
      email,
      password, // This can be undefined if no password is provided
      avatarId || null, // Ensure avatarId is null if not provided
      req.params.id
    );

    if (!response.affectedRows) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User updated", id: req.params.id });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ msg: err.message });
  }
};

const remove_user = async (req, res) => {
  try {
    const [response] = await User.remove(req.params.id);
    console.log(response);
    if (!response.affectedRows) {
      res.status(404).json({ msg: "User not found" });
      return;
    }
    console.log(response);
    res.json({ msg: "User deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const updateAvatar = async (req, res) => {
  if (!req.session || !req.session.user) {
    return res.status(401).json({ msg: "User not authenticated" });
  }

  const { id } = req.session.user;
  const { avatar_id } = req.params;

  try {
    const response = await User.updateAvatar(avatar_id, id); // Ne pas destructurer ici

    if (response.affectedRows === 1) {
      const results = await User.findUserWithAvatar(id); // Pas de destructuration ici
      if (results.length > 0) {
        const avatar = results[0].avatar; // Utiliser le premier élément
        req.session.user.avatar = avatar;
        return res.json({ msg: "Avatar updated", newAvatar: avatar });
      } else {
        return res.status(404).json({ msg: "User not found" }); // Gérer le cas où l'utilisateur n'est pas trouvé
      }
    } else {
      return res.status(500).json({ msg: "Avatar not updated" });
    }
  } catch (error) {
    console.error("Error updating avatar:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

const toggleUserStatus = async (req, res) => {
  try {
    const userId = req.params.id; // Récupérez l'ID de l'utilisateur à partir des paramètres de l'URL

    const [response] = await User.toggleUserActiveStatus(userId);

    if (!response.affectedRows) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User status toggled", userId });
  } catch (err) {
    console.error("Error toggling user status:", err);
    res.status(500).json({ msg: "Server error while toggling user status." });
  }
};

export {
  getAll,
  create_user,
  update_user,
  remove_user,
  updateAvatar,
  toggleUserStatus,
};
