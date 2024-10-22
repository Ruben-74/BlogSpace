import express from "express";
import {
  create_post,
  update_post,
  delete_post,
  filter_posts,
} from "../controller/post.js";
import { home_view, post_view } from "../controller/view.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";
import { uploadImage } from "../../middlewares/uploads.js";

const router = express.Router();

// GET (All) Obtenir tous les posts
router.get("/all", home_view);

// Obtenir un post par son ID  GET (READ)
router.get("/:id", post_view);

// Obtenir les posts selon le terme de recherche
router.get("/search", filter_posts);

// CREATE (POST)
router.post("/create", uploadImage, withAdminAuth, create_post);

// UPDATE (PATCH)
router.patch("/update/:id", uploadImage, withAdminAuth, update_post);

// DELETE (DELETE)
router.delete("/remove/:id", withAdminAuth, delete_post);

export default router;
