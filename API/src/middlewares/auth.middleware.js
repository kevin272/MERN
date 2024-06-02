const LoginCheck = (req, res, next) => {
    let user = {}
    if (user){
    next();}
    else {
    next ({status: 401, message:"Login Required"})}
};
module.exports = LoginCheck;