import { Router } from "express";
import { test, registerUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/test").get(test);
router.route("/signup").post(registerUser);

export default router;