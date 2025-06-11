import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary, deletePreviousFile } from "../utils/cloudinary.js";
import bcryptjs from "bcryptjs";


const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { user: req.user },
            "User fetched successfully"
        ))
})

const test = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "Hello World"
        ))
})

const updateUser = asyncHandler(async (req, res) => {

    if (req.user.id !== req.params.userId) {
        throw new ApiError(401, "Unauthorized request")
    }

    // const userAuthProvider = req.user.authProvider;

        const { username } = req.body;
        if (!username) {
            throw new ApiError(400, "Username is required")
        }

        let profilePicture;
        if (req.file?.path) {
            const profilePictureLocalPath = req.file?.path;

            profilePicture = await uploadOnCloudinary(profilePictureLocalPath);

            if (!profilePicture.url) {
                throw new ApiError(400, "Error while uploading profile picture");
            }

            if (req.user.profilePictureId) {
                const deletionResult = await deletePreviousFile(req.user.profilePictureId);
                if (!deletionResult) {
                    throw new ApiError(400, "Error while deleting previous profile picture");
                }
            }
        }

        const updateFields = {
            username: username.trim(),
            profilePicture: profilePicture?.url || req.user.profilePicture,
        }

        if(req.body.password){
            updateFields.password = await bcryptjs.hash(req.body.password, 10);
        }

        if (profilePicture?.public_id) {
            updateFields.profilePictureId = profilePicture.public_id;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            {
                $set: updateFields
            },
            { new: true }
        ).select("-password -refreshToken -profilePictureId");

        return res
            .status(200)
            .json(new ApiResponse(
                200,
                { user: updatedUser },
                "User updated successfully"
            ))

})

const deleteUser = asyncHandler(async(req,res) => {
    if(req.user.isAdmin === false && req.user.id !== req.params.userId){
        throw new ApiError(401, "Unauthorized request")
    }

    if(req.user.profilePictureId){
        const deletionResult = await deletePreviousFile(req.user.profilePictureId);
        if(!deletionResult){
            throw new ApiError(400, "Error while deleting previous profile picture");
        }
    }
    await User.findByIdAndDelete(req.params.userId);
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "User deleted successfully"
        ))
})

const getUsers = asyncHandler(async(req, res) => {
    if(req.user.isAdmin === false){
        throw new ApiError(401, "Unauthorized request")
    }
    
    const startIndex = Number(req.query.startIndex) || 0;
    const limit = Number(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;

    const users = await User.find()
        .select("-password -refreshToken -profilePictureId")
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit);

    const totalUsers = await User.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    const lastMonthUsers = await User.countDocuments({
        createdAt: { $gte: oneMonthAgo }
    })

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {
                users,
                totalUsers,
                lastMonthUsers
            },
            "Users fetched successfully"
        ))
})
export {
    test,
    updateUser,
    getCurrentUser,
    deleteUser,
    getUsers
}