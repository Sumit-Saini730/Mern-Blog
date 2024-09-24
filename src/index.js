import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";
dotenv.config(
    {
        path: './.env'
    }
)

connectDB()
.then(() => {

    app.use((err, req, res, next) => {
        console.log("Error middleware called!");
        const statusCode = err.statusCode || 500;
        const message = err.message || "Internal Server Error";
    
        res.status(statusCode).json({
            status: "error",
            statusCode,
            message
        });
    });

    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.error("MongoDB connection failed !! ",error);
})