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
  const [response] = await User.updateAvatar(avatar_id, id);

  if (response.affectedRows === 1) {
    const [[avatar]] = await User.findOne(avatar_id);
    req.session.user.avatar = avatar.label;
    res.json({ msg: "Avatar updated", newAvatar: avatar.label });
  } else res.status(500).json({ msg: "Avatar not updated" });
};

export { getAll, create_user, update_user, remove_user, updateAvatar };
