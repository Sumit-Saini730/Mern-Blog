import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {Post} from "../models/post.model.js";
import { uploadOnCloudinary, deletePreviousFile } from "../utils/cloudinary.js";


const createPost = asyncHandler(async (req, res) => {

    if(req.user.isAdmin === false){
        throw new ApiError(401, "You are not authorized to create a post")
    }
    const {title, category, content} = req.body;
    if(!title || !content){
        throw new ApiError(400, "All fields are required")
    }
    
    const author = req.user.id;

    const slug = title.split(" ").join("-").toLowerCase().replace(/[^a-zA-Z0-9-]/g, "");

    const existingPost = await Post.findOne({slug});

    if(existingPost){
        throw new ApiError(400, "Post with same title already exists")
    }

    if(!req.file?.path){
        throw new ApiError(400, "Post image is required")
    }

    const postImageLocalPath = req.file?.path;

    const uploadResponse = await uploadOnCloudinary(postImageLocalPath);

    if(!uploadResponse.url){
        throw new ApiError(400, "Error while uploading post image")
    }

    const newPost = await Post.create({
        title: title,
        content: content,
        author: author,
        category: category || "uncategorized",
        slug: slug,
        image: uploadResponse.url,
        postImageId: uploadResponse.public_id
    })

    const createdPost = await Post.findById(newPost._id);
    if(!createdPost){
        throw new ApiError(400, "Error while creating post")
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {post: createdPost},
            "Post created successfully"
        ))
})

const getPosts = asyncHandler(async (req, res) => {

    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const posts = await Post.find({
        ...req.query.author && {author: req.query.author},
        ...req.query.category && {category: req.query.category},
        ...req.query.slug && {slug: req.query.slug},
        ...req.query.postId && {_id: req.query.postId},
        ...req.query.search && {
            $or: [
                {title: {$regex: req.query.search, $options: "i"}},
                {content: {$regex: req.query.search, $options: "i"}}
            ]
        }
    }).sort({updatedAt: sortDirection}).skip(startIndex).limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthPosts = await Post.countDocuments({
        createdAt: {$gte: oneMonthAgo}
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                posts: posts,
                totalPosts: totalPosts,
                lastMonthPosts: lastMonthPosts
            }
        ))
})

const deletePost = asyncHandler(async (req, res) => {
    
    if(req.user.isAdmin === false || req.user.id.toString() !== req.params.userId){
        throw new ApiError(401, "You are not authorized to delete this post")
    }

    const post = await Post.findById(req.params.postId);
    await Post.findByIdAndDelete(req.params.postId)

    const deleteResponse = await deletePreviousFile(post.postImageId);

    if(!deleteResponse){
        throw new ApiError(400, "Error while deleting post image on cloudinary")
    }
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Post deleted successfully"
        ))
})

export {
    createPost,
    getPosts,
    deletePost
}