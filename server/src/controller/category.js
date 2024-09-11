import Category from "../model/Category.js";

const getAll = async (req, res) => {
  try {
    const response = await Category.findAll();
    res.json(response);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const getById = async (req, res) => {
  try {
    const response = await Category.findById(req.params.id);

    if (response.length === 0) {
      return res.status(404).json({ msg: "Post not found" }); // Réponse 404 si le post n'existe pas
    }
    res.json(response);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const create = async (req, res) => {
  try {
    const [response] = await Category.create(req.body.label);
    //on envoi l'id qui va stocké l'id de la category crée
    const insertId = response.insertId;
    res.json({ msg: "Category created", id: insertId });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const update = async (req, res) => {
  try {
    //sa renvoi un tableau d'objet
    const [response] = await Category.update(req.body.label, req.params.id);
    //Si aucune ligne n'a été affectée, cela peut indiquer que la catégorie avec cet identifiant n'existe pas.

    if (!response.affectedRows) {
      res.status(404).json({ msg: "Category not found" });
      return;
    }

    res.json({ msg: "Category updated", id: req.body.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

const remove = async (req, res) => {
  try {
    //sa renvoi un tableau d'objet
    const [response] = await Category.remove(req.params.id);
    //Si aucune ligne n'a été affectée, cela peut indiquer que la catégorie avec cet identifiant n'existe pas.
    if (!response.affectedRows) {
      res.status(404).json({ msg: "Category not found" });
      return;
    }
    res.json({ msg: "Category removed", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { getAll, getById, create, update, remove };
