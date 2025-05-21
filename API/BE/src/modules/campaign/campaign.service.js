const CampaignModel = require('./campaign.model');

class CampaignService {
    async createCampaign(data) {
        try {
            const campaign = new CampaignModel(data);
            return await campaign.save();
        } catch (error) {
            throw error;
        }
    }

    async getCampaigns(filter = {}, skip = 0, limit = 10) {
        try {
            return await CampaignModel.find(filter)
                .populate('createdBy', ["_id", "name", "email", "role"])
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 });
        } catch (error) {
            throw error;
        }
    }

    async countCampaigns(filter = {}) {
        try {
            return await CampaignModel.countDocuments(filter);
        } catch (error) {
            throw error;
        }
    }

    async getCampaignById(id) {
        try {
            return await CampaignModel.findById(id)
                .populate('createdBy', ["_id", "name", "email", "role"]);
        } catch (error) {
            throw error;
        }
    }

    async updateCampaign(id, data) {
        try {
            return await CampaignModel.findByIdAndUpdate(id, data, { new: true, runValidators: true });
        } catch (error) {
            throw error;
        }
    }

    async deleteCampaign(id) {
        try {
            return await CampaignModel.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }

    async listActiveCampaignsForHome(limit = 5) { // More descriptive name
        try {
            return await CampaignModel.find({ status: 'active' })
                .populate('createdBy', ["_id", "name", "email", "role"])
                .sort({ createdAt: -1 })
                .limit(limit);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CampaignService();