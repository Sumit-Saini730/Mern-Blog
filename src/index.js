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

    app.on("error", (error) => {
        console.log("Error in app !! ", error);
        throw new error;
    })

    app.listen(process.env.PORT || 8000, () => {
        console.log(`App is listening on port ${process.env.PORT}`);
    })
})
.catch((error) => {
    console.error("MongoDB connection failed !! ",error);
})