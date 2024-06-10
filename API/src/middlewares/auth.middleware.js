// creating middlewares for user 
const loginCheck = (req,res,next) => {
    console.log('login check middleware');
    next();
}

module.exports = {
    loginCheck
}

