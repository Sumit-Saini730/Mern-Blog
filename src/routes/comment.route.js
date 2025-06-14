import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { getComments, likeComment } from "../controllers/comment.controller.js";
import { createComment } from "../controllers/comment.controller.js";


const router = Router();

router.route("/getcomments/:postId").get(getComments);
router.route("/create").post(verifyJWT,createComment);

router.route("/likecomment/:commentId").put(verifyJWT, likeComment)

export default router