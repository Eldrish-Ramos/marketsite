const { v2: cloudinary } = require('cloudinary');
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    });

    Readable.from(buffer).pipe(uploadStream);
  });
}

async function deleteImageFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
}

module.exports = { cloudinary, uploadBufferToCloudinary, deleteImageFromCloudinary };