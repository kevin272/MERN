const bcrypt = require('bcryptjs');
const mailService = require('../../services/mail.service'); 
const { randomStringGenerator, deleteFile } = require('../../utils/helper'); 
const UserModel = require('./user.model');
const { statusType } = require('../../config/constants.config');

class UserService {

    // Helper to generate activation token
    generateUserActivationToken = (data) => {
        data.activationToken = randomStringGenerator(20);
        data.activatedFor = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        return data;
    }

    // Transforms request data before creating/updating a user
    transformUserCreate = (req) => {
        const data = req.body;

        // Handle password hashing (only if provided for create, or if it's a password update)
        if (data.password) {
            const salt = bcrypt.genSaltSync(10);
            data.password = bcrypt.hashSync(data.password, salt);
        }

        // Handle single file upload (profile image)
        if (req.file) {
            data.image = `${req.uploadPath}/${req.file.filename}`;
        }
        
        // Add activation token for new users if status is pending
        if (!data._id && data.status === statusType.PENDING) { // Only for new users (no _id)
            this.generateUserActivationToken(data);
        }
        
        return data;
    }

    // Sends activation email
    sendActivationEmail = async (user) => {
        try {
            await mailService.sendEmail({
                to: user.email,
                subject: 'Activate Your SajhaBiz Account',
                html: `
                Dear ${user.name},<br>
                Your account has been created successfully. Please click the link below to activate your account.<br>
                <a href="${process.env.FRONTEND_URL}/activate/${user.activationToken}">Activate Now</a>
                <p>
                <small>This is an auto generated email. Please do not reply to this email.</small>
                </p>
                <p>
                Regards,<br>
                SajhaBiz Team
                </p>
                `
            });
        } catch (error) {
            console.error("Error sending activation email:", error);
        }
    }

    // Create a new user
    createUser = async (data) => {
        try {
            const user = new UserModel(data);
            await user.save();
            return user;
        } catch (error) {
            console.error("Error in createUser service:", error);
            // Delete uploaded file if user creation fails
            if (data.image && typeof data.image === 'string') {
                deleteFile(`./public/uploads/${data.image}`);
            }
            throw error;
        }
    }

    // Get a single user by filter (used for login, activation, detail view)
    getSingleUserByFilter = async (filter) => {
        try {
            const userDetail = await UserModel.findOne(filter);
            if (userDetail) {
                return userDetail;
            } else {
                throw { statusCode: 404, message: "User not found" }; // Changed from 422 to 404 for clarity
            }
        } catch (exception) {
            throw exception;
        }
    }

    // Get a list of users with pagination and search
    getUsers = async (filter, { page = 1, limit = 10, search = '' }) => {
        try {
            let query = {};
            if (search) {
                query = {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { email: { $regex: search, $options: 'i' } },
                        { role: { $regex: search, $options: 'i' } },
                        { expertise: { $regex: search, $options: 'i' } },
                        { title: { $regex: search, $options: 'i' } },
                    ]
                };
            }

            const skip = (page - 1) * limit;
            const total = await UserModel.countDocuments(query);
            const users = await UserModel.find(query)
                                        .skip(skip)
                                        .limit(limit)
                                        .sort({ createdAt: -1 }); // Sort by newest first

            return {
                result: users,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit)
                }
            };
        } catch (exception) {
            throw exception;
        }
    }

    // Get users specifically for the public "Our Team" section
    getUsersForHome = async (limit = 3) => { 
        try {
            const users = await UserModel.find({ 
                role: 'member', 
            })
            .select('name title expertise bio image facebook twitter linkedin email')
            .limit(limit)
            .sort({ createdAt: -1 }); // Newest members first

            return {
                result: users,
                message: "Team members fetched successfully"
            };
        } catch (exception) {
            throw exception;
        }
    }

    // Update a user
    updateUser = async (id, data, previousImage = null) => {
        try {
            const updatedUser = await UserModel.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
            if (!updatedUser) {
                throw { statusCode: 404, message: "User not found for update" };
            }
            // If a new image was uploaded and there was a previous one, delete the old one
            if (data.image && previousImage && data.image !== previousImage) {
                deleteFile(`./public/uploads/${previousImage}`); // Assuming previousImage is the path
            }
            return updatedUser;
        } catch (error) {
            console.error("Error in updateUser service:", error);
            // If update fails, delete the newly uploaded file to prevent orphans
            if (data.image && typeof data.image === 'string' && data.image !== previousImage) {
                deleteFile(`./public/uploads/${data.image}`);
            }
            throw error;
        }
    }

    // Delete a user
    deleteUser = async (id) => {
        try {
            const user = await UserModel.findByIdAndDelete(id);
            if (!user) {
                throw { statusCode: 404, message: "User not found for deletion" };
            }
            // If user had an image, delete it from storage
            if (user.image && typeof user.image === 'string') {
                deleteFile(`./public/uploads/${user.image}`);
            }
            return user;
        } catch (error) {
            console.error("Error in deleteUser service:", error);
            throw error;
        }
    }
}

const userService = new UserService();
module.exports = userService;