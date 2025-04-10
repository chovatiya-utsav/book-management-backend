const { cloudinary } = require('./cloudinary');
const streamifier = require('streamifier');
const fs = require('fs');


const uplodeBookImage = async (fileBuffer) => {
    try {
        // Using cloudinary's upload_stream function
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: 'books',
                resource_type: 'auto'
            },
            (error, result) => {
                if (error) {
                    console.error('❌ Cloudinary upload failed:', error);
                    return null;
                }
                console.log('✅ Image uploaded successfully');
                return result.secure_url;
            }
        );

        // Pipe the fileBuffer into the upload stream
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);

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
