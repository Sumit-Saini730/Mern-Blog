import mongoose , {Schema} from "mongoose";
import bcryptjs from "bcryptjs";

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
            required: true
        }
    }, 
    
    {timestamps: true}
)

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    this.password = await bcryptjs.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcryptjs.compare(password, this.password)
}



export const User = mongoose.model("User", userSchema)