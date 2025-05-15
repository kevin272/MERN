const { fileFilterType } = require('../../config/constants.config');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.miiddleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const { BannerCreateDTO } = require('./banner.request');
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

module.exports = router;