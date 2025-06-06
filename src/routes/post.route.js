import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";

const router = Router();

router.route("/create").post(verifyJWT, upload.single("postImage"), createPost);
router.route("/getposts").get(getPosts);

export default router