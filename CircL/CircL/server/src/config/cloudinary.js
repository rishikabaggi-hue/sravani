// Cloudinary configuration (optional)
// This file can be used later for image uploads and media management

export const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
};

export const isCloudinaryConfigured = () => {
  return !!(cloudinaryConfig.cloud_name && cloudinaryConfig.api_key);
};
