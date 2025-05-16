const Joi = require("joi");
const { statusType } = require('../../config/constants.config');


const InvestorCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid(...Object.values(statusType)).required(),
    image: Joi.string().allow(null,'').optional().default(null),
})

const InvestorUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid(...Object.values(statusType)).required(),
    image: Joi.string().allow(null,'').optional().default(null),
})

module.exports = {
    InvestorCreateDTO,
    InvestorUpdateDTO
}