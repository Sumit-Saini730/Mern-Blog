import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import {User} from "../models/user.model.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, fullName, email, password} = req.body;

    if([fullName, email, username, password].some((field) => field?.trim() === "")){
        throw new ApiError(400, "All fields are required")
    }

    console.log(req.body)
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    if(existingUser) {
        throw new ApiError(
            408,
            "User with same username or email already exists"
        )
    }
    const newUser = await User.create({
        username,
        fullName,
        email,
        password
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken");

    if(!createdUser) {
        throw new ApiError(
            500,
            "Something went wrong while creating user"
        )
    }

    return res
    .status(201)
    .json(new ApiResponse(
        201,
        createdUser,
        "User created successfully"
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

export {
    test,
    registerUser
}