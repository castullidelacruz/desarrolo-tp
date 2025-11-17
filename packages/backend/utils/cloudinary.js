import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";

export const uploadToCloudinary = async (base64File) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  const uploadResult = await cloudinary.uploader
    .upload(base64File, {
      folder: "productos",
      transformation: [
        { width: 360, height: 180, crop: "limit", quality: "auto" },
      ],
    })
    .catch((error) => {
      console.log(error);
    });

  return uploadResult;
};
