const router = require('express').Router();
const { userCreateDTO } = require('./user.request');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.miiddleware');

// set path middleware
const { setPath } = require('../../middlewares/uploader.middleware');

// importing user controller object
const userController = require('./user.controller');
const { bodyValidator } = require('../../middlewares/validator.middleware');

// getting fileUploader middleware
const {uploadFile}= require('../../middlewares/uploader.middleware')












// router uses logincheck for all the routes
router.use(loginCheck);
// creating routes for user




    router.route('/')
    .get(hasPermission,userController.userLists)
    .post(hasPermission,setPath('user'),uploadFile().single('profile'),bodyValidator(userCreateDTO),userController.userCreate);

  router.route('/:id')
    .get(userController.userDetailById)
    .put(userController.userUpdate)
    .delete(userController.userRemove);


module.exports = router;