const Joi = require("joi");
const { statusType } = require('../../config/constants.config');

const CampaignCreateDTO = Joi.object({
    title: Joi.string().min(3).max(150).required(),
    description: Joi.string().min(10).required(),
    goalAmount: Joi.number().min(1).required(),
    startDate: Joi.date().required(),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
    category: Joi.string().required(),
    status: Joi.string().valid(...Object.values(statusType)).default(statusType.PENDING),
    image: Joi.string().allow(null, '').optional().default(null),
});

const CampaignUpdateDTO = Joi.object({
    title: Joi.string().min(3).max(150),
    description: Joi.string().min(10),
    goalAmount: Joi.number().min(1),
    startDate: Joi.date(),
    endDate: Joi.date().greater(Joi.ref('startDate')),
    category: Joi.string(),
    status: Joi.string().valid(...Object.values(statusType)),
    image: Joi.string().allow(null, '').optional().default(null),
});

const CampaignDonateDTO = Joi.object({
    userId: Joi.string().required(),
    amount: Joi.number().min(1).required(),
});

module.exports = {
    CampaignCreateDTO,
    CampaignUpdateDTO,
    CampaignDonateDTO
};