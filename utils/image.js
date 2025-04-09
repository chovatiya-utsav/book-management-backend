const { cloudinary } = require('./cloudinary');
const fs = require('fs');

const uplodeBookImage = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: 'books',
            resource_type: 'auto'
        });
        console.log('✅ Image uploaded successfully');
        fs.unlinkSync(filePath);
        return result.secure_url;
    } catch (error) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
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
