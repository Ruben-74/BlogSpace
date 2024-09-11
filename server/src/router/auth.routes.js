import express from "express";
import {
  login,
  login_view,
  logout,
  register,
  register_view,
} from "../controller/auth.js";

const router = express.Router();

//GET
router.get("/login", login_view);
router.get("/register", register_view);
router.get("/logout", logout);

//POST
router.post("/register", register);
router.post("/login", login);
export default router;
