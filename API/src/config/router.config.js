const router = require('express').Router();


// import routes
const userRouter = require("../modules/user/user.router");
const authRouter = require("../modules/auth/auth.router");
const bannerRouter = require("../modules/banners/banner.router");


router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/banner', bannerRouter);

module.exports = router;