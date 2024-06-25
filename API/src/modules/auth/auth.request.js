const joi = require('joi');

const LoginDTO = joi.object({
    email: joi.string().email().required(),
    password : joi.string().required()
});

module.exports= {
    LoginDTO
}