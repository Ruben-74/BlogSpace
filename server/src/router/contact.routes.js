import Router from "express";

import { create, getAll, remove, update } from "../controller/contact.js";
import withAdminAuth from "../../middlewares/withAdminAuth.js";

const router = Router();

router.get("/all", withAdminAuth, getAll);

router.post("/create", create);

router.patch("/update/:id", withAdminAuth, update);

router.delete("/remove/:id", withAdminAuth, remove);

export default router;
