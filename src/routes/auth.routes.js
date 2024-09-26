import { Router } from "express";
import { google, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/signup").post(registerUser);
router.route("/signin").post(loginUser);
router.route("/google").post(google);
// Protected Routes
router.route("/signout").post(verifyJWT, logoutUser);

export default router