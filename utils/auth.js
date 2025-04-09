const Users = require('../apis/user/user.model');

const getUserID = async (token) => {
    try {
        const user = await Users.findOne({ token }).select('-password -token');
        return user || 'user not found';
    } catch (error) {
        console.error('❌ Failed to get user by token:', error);
        return null;
    }
};

module.exports = { getUserID };
