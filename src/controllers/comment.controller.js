import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { Comment } from "../models/comment.model.js";
import mongoose from "mongoose";

const createComment = asyncHandler(async (req, res) => {
    const { content, postId, userId } = req.body;

    if (req.user.id !== userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    const comment = await Comment.create({
        content: content,
        postId: postId,
        userId: userId
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { comment },
            "Comment created successfully"
        ))
})

const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(postId)) {
        throw new ApiError(400, "Invalid post id")
    }

    const postIdInValidFormat = new mongoose.Types.ObjectId(postId);

    const comments = await Comment.find({ postId: postIdInValidFormat })
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(
            200,
            { comments },
            "Comments fetched successfully"
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body;

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (req.user.id !== comment.userId && req.user.isAdmin === false) {
        throw new ApiError(401, "You are not authorized to update this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(req.params.commentId, {
        content: content
    }, { new: true });
    if (!updatedComment) {
        throw new ApiError(400, "Error while updating comment")
    }
    return res.status(200).json(
        new ApiResponse(
            200,
            { comment: updatedComment },
            "Comment updated successfully"
        )
    );
});

const likeComment = asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const userIndex = comment.likes.indexOf(req.user.id);

    if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);

        await comment.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                { comment },
                "Comment liked successfully"
            )
        );
    } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);

        await comment.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                { comment },
                "Comment unliked successfully"
            )
        );
    }


})
export {
    createComment,
    getComments,
    likeComment,
    updateComment
}