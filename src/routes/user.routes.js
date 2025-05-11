import { Router } from "express";
import { test } from "../controllers/user.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import {upload} from "../middlewares/multer.middleware.js";
import { updateUser } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { deleteUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/test").get(test);


// Protected Routes

router.route("/me").get(verifyJWT, getCurrentUser);

router.route("/update/:userId").patch(
    verifyJWT,
    upload.single("profilePicture"),
    updateUser
);
router.route("/delete/:userId").delete(verifyJWT, deleteUser);

export default router;