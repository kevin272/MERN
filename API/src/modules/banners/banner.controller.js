class BannerController{
        create = async (req,res,next)=>{

        }
        index = async (req,res,next)=>{
        try {
                // pagination
                const page = +req.query.page || 1;
                const limit = +req.query.limit || 10;
                
                const skip = (page - 1) * limit;

                let filter = {};
                if(req.query.search){
                        filter ={
                                title: { $regex: req.query.search, $options: 'i' }
                        
                        }
                }
        } catch (exception) {
                next(exception);
        }
        }
        view = async (req,res,next)=>{

        }
        edit = async (req,res,next)=>{

        }
        delete = async (req,res,next)=>{
            
        }
}

module.exports = new BannerController();