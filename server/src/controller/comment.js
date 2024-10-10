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
    const [comments] = await Comment.findAllFromID(id);
    // console.log(comments)
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Create a new comment
const create = async (req, res) => {
  try {
    const { message, post_id, user_id } = req.body; // Assuming these fields are sent in the request body
    const [result] = await Comment.create({ message, post_id, user_id });
    res.status(201).json({ msg: "Comment created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update an existing comment
const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body; // Assuming only the message is updated
    await Comment.update(message, id);
    res.status(200).json({ msg: "Comment updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Remove a comment
const remove = async (req, res) => {
  try {
    const [response] = await Category.remove(req.params.id);
    console.log(response);
    if (!response.affectedRows) {
      res.status(404).json({ msg: "Comment not found" });
      return;
    }
    console.log(response);
    res.json({ msg: "Comment deleted", id: req.params.id });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

export { getAll, findAllFromID, create, update, remove };
