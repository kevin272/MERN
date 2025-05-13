const { fileFilterType } = require('../../config/constants.config');
const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.miiddleware');
const { setPath, uploadFile } = require('../../middlewares/uploader.middleware');
const { bodyValidator } = require('../../middlewares/validator.middleware');
const router = require('express').Router();


router.route('/')
    .get(loginCheck,hasPermission(['admin']))
    .post(loginCheck,hasPermission(['admin']), setPath('banners') ,uploadFile(fileFilterType.IMAGE).single("image"),bodyValidator())

module.exports = router;