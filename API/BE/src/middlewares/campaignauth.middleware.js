const jwt = require('jsonwebtoken');
const UserModel = require('../modules/user/user.model');
const CampaignModel = require('../modules/campaign/campaign.model'); 
require('dotenv').config();

const campaignAuth = async (req, res, next) => {
    try {
        const campaignId = req.params.id;
        if (!campaignId) {
            return next({ // Use next() to pass to error handler
                statusCode: 400,
                message: 'Campaign ID is required',
                detail: null
            });
        }

        const campaign = await CampaignModel.findById(campaignId).populate('createdBy');

        if (!campaign) {
            return next({ // Use next()
                statusCode: 404,
                message: 'Campaign not found',
                detail: null
            });
        }

        // Check if user is the creator OR an admin
        if (!req.authUser || (!campaign.createdBy._id.equals(req.authUser.id) && req.authUser.role !== 'admin')) {
            return next({ // Use next()
                statusCode: 403,
                message: 'Forbidden, you are not the creator or an admin',
                detail: null
            });
        }

        req.campaign = campaign;
        next();

    } catch (exception) {
        console.error('Exception in campaign auth middleware', exception);
        next(exception); // Pass the exception to the error handler
    }
};

module.exports = {
    campaignAuth
};