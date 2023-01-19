require('dotenv').config();
const cloudinary =require('cloudinary').v2;

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
});
const accessPath={
    preset:()=>process.env.UPLOAD_PRESET,
    folder:()=>process.env.UPLOAD_FOLDER,
} 
module.exports={
    cloudinary,
    accessPath,
}