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
    // banner.service.js

getBanners = async (filter, skip = 0, limit = 10) => {
    return await BannerModel.find(filter)
        .populate('createdBy', ["_id", "name", "email", "role"])
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
}

countBanners = async (filter) => {
    return await BannerModel.countDocuments(filter);
}

getBannerById = async (id) => {
    return await BannerModel.findById(id)
        .populate('createdBy', ["_id", "name", "email", "role"]);
}

updateBanner = async (id, data) => {
    return await BannerModel.findByIdAndUpdate(id, data, { new: true });
}

deleteBanner = async (id) => {
    return await BannerModel.findByIdAndDelete(id);
}

}

const bannerService = new BannerService();

module.exports = bannerService;