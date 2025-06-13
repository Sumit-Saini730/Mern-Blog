import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getComments } from "../controllers/comment.controller.js";
import { createComment } from "../controllers/comment.controller.js";


const router = Router();

router.route("/getcomments/:postId").get(getComments);
router.route("/create").post(verifyJWT,createComment);

export default router