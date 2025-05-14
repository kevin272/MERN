const BannerModel = require('./banner.model');

class BannerService {

    async createBanner(data) {
        try {
            const banner = new BannerModel(data);
            console.log("Calling createBanner with:", data);
            return await banner.save();
        } catch (exception) {
            throw exception;
        }
    }

    async listData({ skip = 0, filter = {} }) {
        try {
            const count = await BannerModel.countDocuments(filter);
            const data = await BannerModel.find(filter)
                .populate('createdBy', ["_id", "name", "email", "role"])
                .skip(skip)
                .sort({ _id: 'desc' });
            return { count, data };
        } catch (exception) {
            throw exception;
        }
    }
}

const bannerService = new BannerService();

module.exports = bannerService;