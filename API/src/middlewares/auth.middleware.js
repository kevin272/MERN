const jwt = require('jsonwebtoken');


// creating middlewares for user 


const loginCheck = (req,res,next) => {
    try {
        const token = req.headers['authorization'] || null;
        if (!token) {
            throw {
                statusCode: 401,
                message: 'Unauthorized',
                detail: null
            }
        }else{
                //bearer token seperation from the token
                token = token.split(' ').pop();    //only token string is extracted
                //token verification    
                const data = jwt.verify(token, process.env.JWT_SECRET);  // got userid from the token


                //data fetch from database 
                //TODO



                req.authUser = {
                    _id : data._id,
                    email: data.email,
                    role: data.role,
                    status: data.status,
                    address: data.address,
                    phone: data.phone,
                    image: data.image,
                }
            next();
           
        }

    } catch (exception) {
        console.log(exception);
        next({
            statusCode: 401,
            message: exception.message || 'Unauthorized',
            detail: null
        
        });
    }
}

module.exports = {
    loginCheck
}

