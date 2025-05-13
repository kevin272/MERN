const Joi = require("joi");

// Define StatusType or import it from the appropriate module
const StatusType = {
    ACTIVE: 'active',
    INACTIVE: 'inactive'
};

const BannerCreateDTO = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    link: Joi.string().uri().empty([null, ""]).optional(),
    status: Joi.string().valid(...Object.values(StatusType)).required(),
    image: Joi.string().required()
})

module.exports = {
    BannerCreateDTO
}