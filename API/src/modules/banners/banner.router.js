const { loginCheck } = require('../../middlewares/auth.middleware');
const { hasPermission } = require('../../middlewares/rbac.miiddleware');
const { setPath } = require('../../middlewares/uploader.middleware');

const router = require('express').Router();


router.route('/')
    .get(loginCheck,hasPermission(['admin']))
    .post(loginCheck,hasPermission(['admin']), setPath('banners'));

module.exports = router;