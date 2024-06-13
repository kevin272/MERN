const Joi = require("joi");


// data tramsfer object
const userCreateDTO = Joi.object({
name:Joi.string().min(3).max(50).required(),
email:Joi.string().email().required().messages({
    'string.email': 'Email must be a valid email',
    'any.required': 'Email is required',

}),
address:Joi.string().optional().empty(),
phpne:Joi.string().min(10).max(15).optional(),
password:Joi.string().min(6).max(20).required(),
confirmPassword:Joi.string().equal(Joi.ref('password')).required().messages({
    'any.only': 'confirm password must match with password',
    'any.required': 'Confirm password must be required',

}),
profile:Joi.string().optional().empty(),
});


module.exports = {
    userCreateDTO
}