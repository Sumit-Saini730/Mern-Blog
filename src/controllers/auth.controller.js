import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true,
    secure: true
}

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // save the refresh token in database
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, fullName, email, password } = req.body;

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    console.log(req.body)
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(
            408,
            "User with same username or email already exists"
        )
    }
    const newUser = await User.create({
        username: username.trim(),
        fullName: fullName.trim(),
        email: email.trim(),
        password: password.trim()
    })

    const createdUser = await User.findById(newUser._id).select("-password -refreshToken -googleId");

    if (!createdUser) {
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

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({email: email});

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const {success, message} = await user.isPasswordCorrect(password);

    if(!success){
        throw new ApiError(401, message)
    }else{
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
        const existingUser = await User.findById(user._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                {user: existingUser},
                "User logged in successfully"
            ))
    }
})

const google = asyncHandler(async (req, res) => {
    const { name, email, googlePhotoUrl } = req.body;

    const existingUser = await User.findOne({ email: email });

    if (existingUser) {
        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(existingUser._id);

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(
            200,
            {user: existingUser},
            "User logged in successfully"
        ))
    }else if(!existingUser){
        const username = email.split("@")[0];
        
        const newUser = await User.create({
            username,
            fullName: name,
            email,
            authProvider: "google",
            profilePicture: googlePhotoUrl
        })

        const {accessToken, refreshToken} = await generateAccessAndRefreshToken(newUser._id);
        const existingUser = await User.findById(newUser._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(
                200,
                {user: existingUser},
                "User logged in successfully"
            ))
    }

})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user.id,
        {
            $unset: { refreshToken: 1 }
        },
        { new: true }
    )

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(
            200,
            {},
            "User logged out successfully"
        ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            { user: req.user },
            "User fetched successfully"
        ))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!decodedToken) {
            throw new ApiError(401, "Invalid refresh token")
        }

        const user = await User.findById(decodedToken?.id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token")
        }

        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(new ApiResponse(
                200,
                {},
                "Access token refreshed successfully"
            ))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    google,
}