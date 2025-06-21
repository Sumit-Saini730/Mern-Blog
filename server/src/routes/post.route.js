import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createPost } from "../controllers/post.controller.js";
import { getPosts } from "../controllers/post.controller.js";
import { deletePost } from "../controllers/post.controller.js";
import { updatePost } from "../controllers/post.controller.js";

const router = Router();

router.route("/getposts").get(getPosts);
router.route("/create").post(verifyJWT, upload.single("postImage"), createPost);
router.route("/delete/:postId/:userId").delete(verifyJWT, deletePost);
router.route("/update/:postId/:userId").patch(
    verifyJWT,
    upload.single("postImage"),
    updatePost
);

export default router