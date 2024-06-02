const express = require('express');
const router = express.Router();
const userCtrl = require("./user.controller");
const LoginCheck = require("../../middlewares/auth.middleware");
const hasPermission = require("../../middlewares/rbac.middleware");

// Apply LoginCheck middleware globally
router.use(LoginCheck);

// Define routes
router.route('/')
    .post(hasPermission, userCtrl.userCreate)
    .get(userCtrl.UserDetail);

// Define routes with parameters
router.route('/:id')
    .get(userCtrl.UserDetailByID)
    .put(userCtrl.UserUpdateByID)
    .delete(userCtrl.UserDeleteByID);

module.exports = router;
