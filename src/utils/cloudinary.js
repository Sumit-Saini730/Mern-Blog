import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";
import dotenv from "dotenv";
dotenv.config(
    {
        path: './.env'
    }
)

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const deletePreviousFile = async (oldFilePublicId, resource_type = "image") => {

    try {
        // delete files on cloudinary
        const deletionResult = await cloudinary.uploader.destroy(oldFilePublicId, {resource_type: resource_type})
        // console.log("cloudinary ",deletionResult)
        // console.log("deletion result in cloudinary ",deletionResult.result)
        if(deletionResult.result !== "ok"){
            return false
        }
        return true
    } catch (error) {
        // throw new ApiError()
        console.log("Error in file deleting on cloudinary ", error);
        return null;
    }
}

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfuly
        // console.log("file is uploaded on cloudinary", response.url);
        fs.unlinkSync(localFilePath);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        console.log("Error in file uploading on cloudinary ", error);
        return null;
    }
}

export {uploadOnCloudinary,deletePreviousFile}