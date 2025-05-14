const Joi = require("joi");
const { statusType } = require('../../config/constants.config');


const BannerCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    link: Joi.string().uri().empty([null, ""]).optional(),
    status: Joi.string().valid(...Object.values(statusType)).required(),
    image: Joi.string().required()
})

module.exports = {
    BannerCreateDTO
}