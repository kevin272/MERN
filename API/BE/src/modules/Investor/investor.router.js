const { fileFilterType } = require('../../config/constants.config');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.miiddleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const { InvestorCreateDTO , InvestorUpdateDTO} = require('./investor.request');
const InvestorController = require('./investor.controller');
const router = require('express').Router();


router.route('/')
.post(
        (req, res, next) => { console.log('🧭 Entered Investor POST route'); next(); },
        loginCheck,
        (req, res, next) => { console.log('🔑 User is logged in'); next(); },
        hasPermission(['admin']),
        (req, res, next) => { console.log('🔑 User has permission'); next(); },
        setPath('Investor'),
        (req, res, next) => { console.log('🧭 Set path for Investor upload'); next(); },
        uploadFile().single('image'),
        (req, res, next) => { console.log('📸 Uploaded file:', req.file); next(); },
        bodyValidator(InvestorCreateDTO),
        InvestorController.create
)
.get(loginCheck, hasPermission(['admin']), InvestorController.index);


router.route('/:id')
    .get( InvestorController.view)
        .patch(loginCheck, hasPermission(['admin']), setPath('Investor'), uploadFile().single('image'), bodyValidator(InvestorUpdateDTO), InvestorController.edit)
    .delete(loginCheck, hasPermission(['admin']), InvestorController.delete);
module.exports = router;