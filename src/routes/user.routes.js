import { Router } from "express";
import { test, registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/test").get(test);
router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);

// Protected Routes
router.route("/signout").post(verifyJWT, logoutUser);

export default router;