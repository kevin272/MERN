const joi = require('joi');
const { roleType } = require('../../config/constants.config');

const TeamMemberCreateDTO = joi.object({
    fullname: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
      'any.only': 'Passwords must match'
    }),
    phone: joi.string().pattern(/^\d{10}$/).required().messages({
      'string.pattern.base': 'Invalid phone number'
    }),
    facebook: joi.string().uri().allow(null),
    twitter: joi.string().uri().allow(null),
    linkedin: joi.string().uri().allow(null),
    title: joi.string().required(),
    expertise: joi.string().required(),

    role: joi.string().valid(...Object.values(roleType)).required(),
  
    image: joi.any().optional().default(null),
    description: joi.string().min(10).max(5000).required(),
});

const TeamMemberUpdateDTO = joi.object({
    fullname: joi.string().min(3).max(100).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(100).required(),
    confirmPassword: joi.string().valid(joi.ref('password')).required().messages({
        'any.only': 'Passwords must match'
    }),
    phone: joi.string().pattern(/^\d{10}$/).required().messages({
        'string.pattern.base': 'Invalid phone number'
    }),
    
    facebook: joi.string().uri().allow(null),
    title: joi.string().required(),
    expertise: joi.string().required(),
    twitter: joi.string().uri().allow(null),
    linkedin: joi.string().uri().allow(null),
    
    // Role can now be a simple string
    role: joi.string().valid(...Object.values(roleType)).required(),

    image: joi.string().allow(null,'').optional().default(null), 
    description: joi.string().min(10).max(5000).required(),
});

module.exports = {
    TeamMemberCreateDTO,
    TeamMemberUpdateDTO
};
