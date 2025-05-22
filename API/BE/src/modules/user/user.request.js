const Joi = require("joi");

// DTO for creating a new user (e.g., by an admin adding a team member)
const userCreateDTO = Joi.object({
    name: Joi.string().min(3).max(50).required(), 
    email: Joi.string().email().required().messages({
        'string.email': 'Email must be a valid email',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).max(20).required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Confirm password must match with password',
        'any.required': 'Confirm password must be required',
    }),
    role: Joi.string().valid('admin', 'member', 'user').default('user'),
    status: Joi.string().valid('pending', 'active', 'inactive').default('pending'),
    
    title: Joi.string().max(100).allow(null, '').optional(),
    expertise: Joi.string().max(200).allow(null, '').optional(),
    bio: Joi.string().max(1000).allow(null, '').optional(), 
    facebook: Joi.string().uri().allow(null, '').optional(),
    twitter: Joi.string().uri().allow(null, '').optional(),
    linkedin: Joi.string().uri().allow(null, '').optional(),
    phone: Joi.string().min(10).max(15).optional(), 
    address: Joi.string().max(255).allow(null, '').optional(),
    
    image: Joi.any().optional(), // This allows the file input (multer handles the actual file)
});

// DTO for updating an existing user
const userUpdateDTO = Joi.object({
    name: Joi.string().min(3).max(50).optional(),
    email: Joi.string().email().optional().messages({
        'string.email': 'Email must be a valid email',
    }),
    password: Joi.string().min(6).max(20).optional(),
    confirmPassword: Joi.string().valid(Joi.ref('password')).optional().messages({
        'any.only': 'Confirm password must match with password',
    }),
    role: Joi.string().valid('admin', 'member', 'user').optional(),
    status: Joi.string().valid('pending', 'active', 'inactive').optional(),
    
    title: Joi.string().max(100).allow(null, '').optional(),
    expertise: Joi.string().max(200).allow(null, '').optional(),
    bio: Joi.string().max(1000).allow(null, '').optional(), // Renamed from description
    facebook: Joi.string().uri().allow(null, '').optional(),
    twitter: Joi.string().uri().allow(null, '').optional(),
    linkedin: Joi.string().uri().allow(null, '').optional(),
    phone: Joi.string().min(10).max(15).optional(),
    address: Joi.string().max(255).allow(null, '').optional(),

    image: Joi.any().optional(), 
}).min(1); // At least one field must be provided for update

module.exports = {
    userCreateDTO,
    userUpdateDTO
};