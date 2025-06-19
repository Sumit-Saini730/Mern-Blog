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

const deleteComment = asyncHandler(async (req, res) => {

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    if (req.user.id !== comment.userId && req.user.isAdmin === false) {
        throw new ApiError(401, "You are not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Comment deleted successfully"
        ))
})

const getAllComments = asyncHandler(async (req, res) => {
    if(!req.user.isAdmin){
        throw new ApiError(401, "Unauthorized request! You are not admin.")
    }

    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const comments = await Comment.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

    const totalComments = await Comment.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthComments = await Comment.countDocuments({
        createdAt: { $gte: oneMonthAgo }
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                comments: comments,
                totalComments: totalComments,
                lastMonthComments: lastMonthComments
            },
            "Comments fetched successfully"
        ))
})
export {
    createComment,
    getComments,
    likeComment,
    updateComment,
    deleteComment,
    getAllComments
}