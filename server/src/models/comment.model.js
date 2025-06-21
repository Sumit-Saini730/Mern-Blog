import mongoose,{Schema} from "mongoose";

const commentSchema = new Schema(
    {
        content: {
            type: String,
            required: true
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        likes: {
            type: Array,
            default: []
        },
        numberOfLikes: {
            type: Number,
            default: 0
        }
        
    },
    {
        timestamps: true
    }
)

export const Comment = mongoose.model("Comment", commentSchema)
