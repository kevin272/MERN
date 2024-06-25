class BannerService{

    crateBanner= async (data)=>{
        try {
            const banner = new BannerModel(data);
            return await banner.save();
        } catch (exception) {
            throw exception;
        }
    }

    listData = async ({skip =0, filter = {}})=>{
        try {
            const count = await BannerModel.countDocuments(filter);
            const data = await BannerModel.find(filter).populate('createdBy',["_id","name","email","role"]).skip(skip).sort({_id:'desc'})
        } catch (exception) {
            throw exception;
        }
    }
}