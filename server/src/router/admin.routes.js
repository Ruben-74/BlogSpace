import express from "express";
import { create_post } from "../controller/admin/create.js";
import { update_post } from "../controller/admin/update.js";
import { delete_post } from "../controller/admin/delete.js";

const router = express.Router();

// CREATE (POST)
router.post("/api/v1/post/create", create_post);

// UPDATE (PATCH)
router.patch("/api/v1/post/update/:id", update_post);

// DELETE (DELETE)
router.delete("/api/v1/post/delete/:id", delete_post);

export default router;
