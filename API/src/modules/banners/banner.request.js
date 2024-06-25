const Joi = require("joi");
const joi = require("joi");

const BannerCreatedTo = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    link: Joi.string().url().empty(null,"").optional(),
    status: Joi.string().valid(...Object.values(StatusType)).required()
})