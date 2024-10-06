import mongoose , {Schema} from "mongoose";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function(){
                return this.authProvider === "local"
            }
        },
        authProvider: {
            type: String,
            enums: ["local", "google"],
            default: "local"
        },
        profilePicture: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
        },
        refreshToken: {
            type: String
        }
    }, 
    
    {timestamps: true}
)

userSchema.pre("save", async function(next){

    if(this.authProvider !== "local") return next();
    if(!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    if (this.authProvider !== "local") {
      // User signed up with Google, and is trying to use email/password
      return {
        success: false,
        message: "It seems like you're signed up with Google. Please login with Google."
      };
    }
  
    // Check if the password matches (only for local email/password sign-up)
    const isMatch = await bcryptjs.compare(password, this.password);
    if (!isMatch) {
      return {
        success: false,
        message: "Incorrect Password."
      };
    }
  
    // If password matches
    return {
      success: true,
      message: "Password is correct."
    };
  };

userSchema.methods.generateAccessToken = function (){
    return jwt.sign(
        {
            id: this._id,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function (){
    return jwt.sign(
        {
            id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)