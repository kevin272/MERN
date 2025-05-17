const BannerService = require('./banner.service');
const { uploadImage} = require('../../config/cloudinary.config');
const { deleteFile } = require('../../utils/helper');
const { statusType } = require('../../config/constants.config');

class BannerController{
        create = async (req,res,next)=>{
    try {
      const data = req.body;
      data.createdBy = req.authUser.id;
      data.image = await uploadImage('./public/uploads/banner/' + req.file.filename);
      deleteFile('./public/uploads/banner/'+req.file.filename);
      console.log(data);
      const banner = await BannerService.createBanner(data);
      res.json({
        result: banner,
        message: "Banner Created Successfully",
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

                const banners = await BannerService.getBanners(filter, skip, limit);
                const total = await BannerService.countBanners(filter);

                res.json({
                    result: banners,
                    message: "Banners fetched successfully",
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
                const banner = await BannerService.getBannerById(req.params.id);
                if (!banner) {
                    return res.status(404).json({ message: "Banner not found" });
                }
                res.json({
                    result: banner,
                    message: "Banner fetched successfully",
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
                    data.image = await uploadImage('./public/uploads/banner/' + req.file.filename);
                    deleteFile('./public/uploads/banner/' + req.file.filename);
                }
                const banner = await BannerService.updateBanner(req.params.id, data);
                if (!banner) {
                    return res.status(404).json({ message: "Banner not found" });
                }
                res.json({
                    result: banner,
                    message: "Banner updated successfully",
                    meta: null
                });
            } catch (exception) {
                next(exception);
            }
        }

        delete = async (req, res, next) => {
            try {
                const banner = await BannerService.deleteBanner(req.params.id);
                if (!banner) {
                    return res.status(404).json({ message: "Banner not found" });
                }
                res.json({
                    result: banner,
                    message: "Banner deleted successfully",
                    meta: null
                });
            } catch (exception) {
                next(exception);
            }
        }

    ListForHome = async (req, res, next) => {
        try{
            const data = await BannerService.listData({
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
                message: "Banner List",
                meta: null
            })
        }
        catch (exception) {
            next(exception);
        }
}
}

module.exports = new BannerController();