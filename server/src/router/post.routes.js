import express from "express";
import {
  create_post,
  update_post,
  delete_post,
  addImage,
} from "../controller/post.js";
import { home_view, post_view } from "../controller/view.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";
import { uploadImage } from "../../middlewares/uploads.js";

const router = express.Router();

// GET (All) Obtenir tous les posts
router.get("/all", home_view);

// Obtenir un post par son ID  GET (READ)
router.get("/post/:id", post_view);

router.post("/addImage", addImage);

// CREATE (POST)
router.post("/create", uploadImage, withAdminAuth, create_post);

// UPDATE (PATCH)
router.patch("/update/:id", uploadImage, withAdminAuth, update_post);

// DELETE (DELETE)
router.delete("/remove/:id", uploadImage, withAdminAuth, delete_post);

export default router;
