import mongoose, { Schema } from "mongoose";

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        content: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            default: "uncategorized"
        },
        slug: {
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
)

export const Post = mongoose.model("Post", postSchema);