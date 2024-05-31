const express = require('express');
const router = express.Router();
const userCtrl = require ("./user.controller")
const LoginCheck = (req, res, next) => {
    let user = {}
    if (user){
    next();}
    else {
    next ({status: 401, message:"Login Required"})}
};
const hasPermission = (req,res,next) => {
    next()
}

router.use (LoginCheck)

// Define routes
router.route('/')
    .post(userCtrl.userCreate)
    .get(userCtrl.UserDetail)

// Define routes with parameters
router.route('/:id')
    .get(userCtrl.UserDetailByID)
    .put(userCtrl.UserUpdateByID)
    .delete(userCtrl.UserDeleteByID)

module.exports = router;