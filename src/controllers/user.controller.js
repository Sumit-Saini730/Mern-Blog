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
    if(req.user.id !== req.params.userId){
        throw new ApiError(401, "Unauthorized request")
    }

    if(req.user.profilePictureId){
        const deletionResult = await deletePreviousFile(req.user.profilePictureId);
        if(!deletionResult){
            throw new ApiError(400, "Error while deleting previous profile picture");
        }
    }
    await User.findByIdAndDelete(req.user.id);
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            {},
            "User deleted successfully"
        ))
})
export {
    test,
    updateUser,
    getCurrentUser,
    deleteUser
}