const InvestorModel = require('./investor.model');

class InvestorService {

    async createInvestor(data) {
        try {
            const Investor = new InvestorModel(data);
            console.log("Calling createInvestor with:", data);
            return await Investor.save();
        } catch (exception) {
            throw exception;
        }
    }

    async listData({ skip = 0, filter = {} }) {
        try {
            const count = await InvestorModel.countDocuments(filter);
            const data = await InvestorModel.find(filter)
                .populate('createdBy', ["_id", "name", "email", "role"])
                .skip(skip)
                .sort({ _id: 'desc' });
            return { count, data };
        } catch (exception) {
            throw exception;
        }
    }
    // Investor.service.js

getInvestors = async (filter, skip = 0, limit = 10) => {
    return await InvestorModel.find(filter)
        .populate('createdBy', ["_id", "name", "email", "role"])
        .skip(skip)
        .limit(limit)
        .sort({ _id: -1 });
}

countInvestors = async (filter) => {
    return await InvestorModel.countDocuments(filter);
}

getInvestorById = async (id) => {
    return await InvestorModel.findById(id)
        .populate('createdBy', ["_id", "name", "email", "role"]);
}

updateInvestor = async (id, data) => {
    return await InvestorModel.findByIdAndUpdate(id, data, { new: true });
}

deleteInvestor = async (id) => {
    return await InvestorModel.findByIdAndDelete(id);
}

}

const investorService = new InvestorService();

module.exports = investorService;