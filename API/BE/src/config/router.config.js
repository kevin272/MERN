const router = require('express').Router();


// import routes
const userRouter = require("../modules/user/user.router");
const authRouter = require("../modules/auth/auth.router");
const bannerRouter = require("../modules/banners/banner.router");
const investorRouter = require("../modules/Investor/investor.router");
const campaignRouter = require("../modules/campaign/campaign.router");

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/banner', bannerRouter);
router.use('/investor', investorRouter);
router.use('/campaign', campaignRouter);

module.exports = router;