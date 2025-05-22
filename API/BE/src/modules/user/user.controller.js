const userService = require('./user.service');
const { uploadImage } = require('../../config/cloudinary.config'); // Assuming Cloudinary upload
const { deleteFile } = require('../../utils/helper'); // For deleting local files after upload

class UserController {
    // Get all users (for admin list)
    userLists = async (req, res, next) => {
        try {
            const { page, limit, search } = req.query;
            const users = await userService.getUsers({}, { page: parseInt(page), limit: parseInt(limit), search });
            res.status(200).json({
                result: users.result,
                message: 'Users fetched successfully',
                meta: users.meta
            });
        } catch (error) {
            next(error);
        }
    }

    // Create a new user (for admin to add team members)
    userCreate = async (req, res, next) => {
        try {
            let data = userService.transformUserCreate(req);
            
            // If an image was uploaded, upload to Cloudinary and get URL
            if (req.file) {
                const imageUrl = await uploadImage('./public/uploads/user/' + req.file.filename);
                data.image = imageUrl;
                deleteFile('./public/uploads/user/' + req.file.filename); // Delete local temp file
            }

            const user = await userService.createUser(data);
            
            // Send activation email if status is pending
            if (user.status === statusType.PENDING) {
                await userService.sendActivationEmail(user);
            }

            res.status(201).json({
                result: user,
                message: "User Created Successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }

    // Get user details by ID (for admin edit or public overview)
    userDetailById = async (req, res, next) => {
        try {
            const id = req.params.id;
            const user = await userService.getSingleUserByFilter({ _id: id });
            res.status(200).json({
                result: user,
                message: 'User details fetched successfully',
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }

    // Update user profile by ID
    userUpdate = async (req, res, next) => {
        try {
            const id = req.params.id;
            const existingUser = await userService.getSingleUserByFilter({ _id: id });
            if (!existingUser) {
                throw { statusCode: 404, message: "User not found for update" };
            }

            let data = req.body;
            let previousImage = existingUser.image; // Store old image path

            // Handle new password if provided
            if (data.password) {
                const salt = bcrypt.genSaltSync(10);
                data.password = bcrypt.hashSync(data.password, salt);
            } else {
                // If password is not provided in update, ensure it's not overwritten
                delete data.password; 
            }

            // Handle file upload for profile image
            if (req.file) {
                const imageUrl = await uploadImage('./public/uploads/user/' + req.file.filename);
                data.image = imageUrl;
                deleteFile('./public/uploads/user/' + req.file.filename); 
            } else {
                if (data.image === null) { 
                    previousImage = existingUser.image; 
                    data.image = null;
                } else {
                    data.image = existingUser.image; // Keep the old image if no new one
                }
            }
            
            const updatedUser = await userService.updateUser(id, data, previousImage);

            res.status(200).json({
                result: updatedUser,
                message: 'User updated successfully',
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }

    // Remove user by ID
    userRemove = async (req, res, next) => {
        try {
            const id = req.params.id;
            const deletedUser = await userService.deleteUser(id);
            res.status(200).json({
                result: deletedUser,
                message: 'User deleted successfully',
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }

    // Get a list of users for the public "Our Team" page
    listForHome = async (req, res, next) => {
        try {
            const limit = parseInt(req.query.limit) || 3; // Default to 3 members for home page
            const teamMembers = await userService.getUsersForHome(limit);
            res.status(200).json({
                result: teamMembers.result,
                message: teamMembers.message,
                meta: null
            });
        } catch (error) {
            next(error);
        }
    }
}

const userController = new UserController();
module.exports = userController;