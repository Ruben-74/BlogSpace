import Router from "express";

import {
  create,
  getAll,
  getById,
  remove,
  update,
} from "../controller/category.js";

const router = Router();

//Vues
router.get("/all", getAll);
router.get("/:id", getById);

// CREATE (POST)
router.post("/create", create);

// // UPDATE (PATCH)
router.patch("/update/:id", update);

// // DELETE (DELETE)
router.delete("/remove/:id", remove);

export default router;
