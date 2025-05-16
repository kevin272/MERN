const { uploadImage} = require('../../config/cloudinary.config');
const { deleteFile } = require('../../utils/helper');
const slugify = require('slugify');
const { statusType } = require('../../config/constants.config');
const investorService = require('./investor.service');

class InvestorController{
        create = async (req,res,next)=>{
    try {
      const data = req.body;
      data.createdBy = req.authUser.id;
      data.slug = slugify(data.title, { lower: true });
      data.image = await uploadImage('./public/uploads/Investor/' + req.file.filename);
      deleteFile('./public/uploads/Investor/'+req.file.filename);
      console.log(data);
      const Investor = await investorService.createInvestor(data);
      res.json({
        result: Investor,
        message: "Investor Created Successfully",
        meta: null
        });
}

        catch (exception) {
                console.log(exception);
                next(exception);
        }
        }
        index = async (req, res, next) => {
            try {
                // pagination
                const page = +req.query.page || 1;
                const limit = +req.query.limit || 10;
                const skip = (page - 1) * limit;

                let filter = {};
                if (req.query.search) {
                    filter = {
                        title: { $regex: req.query.search, $options: 'i' }
                    }
                }

                const Investors = await investorService.getInvestors(filter, skip, limit);
                const total = await investorService.countInvestors(filter);

                res.json({
                    result: Investors,
                    message: "Investors fetched successfully",
                    meta: {
                        total,
                        page,
                        limit
                    }
                });
            } catch (exception) {
                next(exception);
            }
        }

        view = async (req, res, next) => {
            try {
                const Investor = await investorService.getInvestorById(req.params.id);
                if (!Investor) {
                    return res.status(404).json({ message: "Investor not found" });
                }
                res.json({
                    result: Investor,
                    message: "Investor fetched successfully",
                    meta: null
                });
            } catch (exception) {
                next(exception);
            }
        }

        edit = async (req, res, next) => {
            try {
                const data = req.body;
                if (req.file) {
                    data.image = await uploadImage('./public/uploads/Investor/' + req.file.filename);
                    deleteFile('./public/uploads/Investor/' + req.file.filename);
                }
                const Investor = await investorService.updateInvestor(req.params.id, data);
                if (!Investor) {
                    return res.status(404).json({ message: "Investor not found" });
                }
                res.json({
                    result: Investor,
                    message: "Investor updated successfully",
                    meta: null
                });
            } catch (exception) {
                next(exception);
            }
        }

        delete = async (req, res, next) => {
            try {
                const Investor = await investorService.deleteInvestor(req.params.id);
                if (!Investor) {
                    return res.status(404).json({ message: "Investor not found" });
                }
                res.json({
                    result: Investor,
                    message: "Investor deleted successfully",
                    meta: null
                });
            } catch (exception) {
                next(exception);
            }
        }

    ListForHome = async (req, res, next) => {
        try{
            const data = await investorService.listData({
                limit:3,
                skip:0,
                filter: {
                    status: statusType.ACTIVE,
                    startDate: { $lte: new Date() },
                    endDate: { $gte: new Date() }
                }

            })
            res.json({
                result: data,
                message: "Investor List",
                meta: null
            })
        }
        catch (exception) {
            next(exception);
        }
}
}

module.exports = new InvestorController();