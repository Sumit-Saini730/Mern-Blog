import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

const __dirname = path.resolve();
const app = express();

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
));

app.use(express.json( {limit: '16kb'} ))
app.use(express.urlencoded({ extended: true, limit: '16kb' }))
app.use(cookieParser())

app.use(express.static(path.join(__dirname, "/client/dist")));

// routes import
import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/posts", postRouter)
app.use("/api/v1/comments", commentRouter)

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
})
export default app;