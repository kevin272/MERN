const { uploadImage } = require('../../config/cloudinary.config');
const { deleteFile } = require('../../utils/helper');
const slugify = require('slugify');
const { statusType } = require('../../config/constants.config');
const campaignService = require('./campaign.service');

class CampaignController {
    create = async (req, res, next) => {
        try {
            const data = req.body;
            data.createdBy = req.authUser.id; //  Get user ID from auth middleware
            data.slug = slugify(data.title, { lower: true });
            data.image = await uploadImage('./public/uploads/campaigns/' + req.file.filename);
            deleteFile('./public/uploads/campaigns/' + req.file.filename);

            const campaign = await campaignService.createCampaign(data);
            res.status(201).json({ //  Use 201 for successful creation
                result: campaign,
                message: "Campaign created successfully",
                meta: null
            });
        } catch (error) {
            console.error(error);
            next(error);
        }
    };

    index = async (req, res, next) => {
        try {
            const page = +req.query.page || 1;
            const limit = +req.query.limit || 10;
            const skip = (page - 1) * limit;

            let filter = {};
            if (req.query.search) {
                filter = {
                    title: { $regex: req.query.search, $options: 'i' }
                };
            }

            const campaigns = await campaignService.getCampaigns(filter, skip, limit);
            const total = await campaignService.countCampaigns(filter);

            res.json({
                result: campaigns,
                message: "Campaigns fetched successfully",
                meta: {
                    total,
                    page,
                    limit
                }
            });
        } catch (error) {
            next(error);
        }
    };

    view = async (req, res, next) => {
        try {
            const campaign = await campaignService.getCampaignById(req.params.id);
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            res.json({
                result: campaign,
                message: "Campaign fetched successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    };

    edit = async (req, res, next) => {
        try {
            const data = req.body;
            if (req.file) {
                data.image = await uploadImage('./public/uploads/campaigns/' + req.file.filename);
                deleteFile('./public/uploads/campaigns/' + req.file.filename);
            }

            const campaign = await campaignService.updateCampaign(req.params.id, data);
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            res.json({
                result: campaign,
                message: "Campaign updated successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req, res, next) => {
        try {
            const campaign = await campaignService.deleteCampaign(req.params.id);
            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }
            res.json({
                result: campaign,
                message: "Campaign deleted successfully",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    };

    ListForHome = async (req, res, next) => {
        try {
            const data = await campaignService.listActiveCampaignsForHome(3); // Example limit of 3
            res.json({
                result: data,
                message: "Campaign List for Home",
                meta: null
            });
        } catch (exception) {
            next(exception);
        }
    }

    donateToCampaign = async (req, res, next) => {
        try {
            const { campaignId } = req.params;
            const { userId, amount } = req.body;

            const campaign = await campaignService.donateToCampaign(campaignId, userId, amount);

            if (!campaign) {
                return res.status(404).json({ message: "Campaign not found" });
            }

            res.json({
                result: campaign,
                message: "Donation successful",
                meta: null
            });
        } catch (error) {
            next(error);
        }
    };

    getUserDonationHistory = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const donations = await campaignService.getUserDonationHistory(userId);
        res.json({
            result: donations,
            message: "User donation history retrieved successfully",
            meta: null
        });
    } catch (error) {
        next(error);
    }
};
}


module.exports = new CampaignController();