import { Router } from "express";
import admin_router from "./admin.routes.js";
import auth_router from "./auth.routes.js";
import category_router from "./category.router.js";
import { home_view, post_view } from "../controller/user/view.js";

const router = Router();

// GET (READ) Obtenir tous les posts
router.get("/api/v1/posts", home_view);

// Obtenir un post par son ID  GET (READ)
router.get("/api/v1/post/:id", post_view);

// Admin CRUD
router.use("/admin", admin_router);

//Authentification
router.use("/auth", auth_router);

//category
router.use("/category", category_router);

// GET NOT FOUND (tjr a la fin)
router.get("*", (req, res) => {
  res.status(404).json({ msg: " Page not found" });
});

export default router;
