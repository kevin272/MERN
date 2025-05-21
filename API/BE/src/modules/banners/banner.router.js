const { fileFilterType } = require('../../config/constants.config');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.middleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const { BannerCreateDTO , BannerUpdateDTO} = require('./banner.request');
const bannerController = require('./banner.controller');
const router = require('express').Router();


router.route('/')
.post(
        (req, res, next) => { console.log('🧭 Entered banner POST route'); next(); },
        loginCheck,
        (req, res, next) => { console.log('🔑 User is logged in'); next(); },
        hasPermission(['admin']),
        (req, res, next) => { console.log('🔑 User has permission'); next(); },
        setPath('banner'),
        (req, res, next) => { console.log('🧭 Set path for banner upload'); next(); },
        uploadFile().single('image'),
        (req, res, next) => { console.log('📸 Uploaded file:', req.file); next(); },
        bodyValidator(BannerCreateDTO),
        bannerController.create
)
.get(loginCheck, hasPermission(['admin']), bannerController.index);


router.route('/:id')
    .get( bannerController.view)
        .patch(loginCheck, hasPermission(['admin']), setPath('banner'), uploadFile().single('image'), bodyValidator(BannerUpdateDTO), bannerController.edit)
    .delete(loginCheck, hasPermission(['admin']), bannerController.delete);
module.exports = router;