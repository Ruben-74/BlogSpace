import { Router } from "express";
import {
  create_user,
  getAll,
  remove_user,
  update_user,
  updateAvatar,
} from "../controller/user.js";
import withUserAuth from "../../middlewares/withUserAuth.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";

const router = Router();

router.get("/list", getAll);

// CREATE (POST)
router.post("/create", withAdminAuth, create_user);

// UPDATE (PATCH)
router.patch("/update/:id", withAdminAuth, update_user);

// DELETE (DELETE)
router.delete("/remove/:id", withAdminAuth, remove_user);

router.patch("/avatar/:avatar_id", withUserAuth, updateAvatar);

export default router;
