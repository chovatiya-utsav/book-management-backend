const { cloudinary } = require('./cloudinary');
const streamifier = require('streamifier');
const fs = require('fs');


const uplodeBookImage = async (fileBuffer) => {
    try {
        // Using cloudinary's upload_stream function to handle file buffer upload
        const uploadResult = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'books',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) {
                        reject('❌ Cloudinary upload failed: ' + error);
                    } else {
                        resolve(result.secure_url);
                    }
                }
            );

            // Pipe the fileBuffer into the upload stream
            streamifier.createReadStream(fileBuffer).pipe(uploadStream);
        });

        console.log('✅ Image uploaded successfully');
        return uploadResult; // Return the secure URL of the uploaded image
    } catch (error) {
        console.error('❌ Cloudinary upload failed:', error);
        return null;
    }
};


const deleteCloudinaryImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result === 'ok') {
            console.log('✅ Image deleted successfully');
            return true;
        } else {
            console.log('⚠️ Image not found or already deleted');
            return false;
        }
    } catch (error) {
        console.error('❌ Failed to delete image from Cloudinary:', error);
        return false;
    }
};

module.exports = { uplodeBookImage, deleteCloudinaryImage };
