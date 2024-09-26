import { Router } from "express";
import { test} from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/test").get(test);


// Protected Routes

export default router;