const router = require('express').Router();


// import routes
const userRouter = require("../modules/user/user.router");
const authRouter = require("../modules/auth/auth.router");
const campaignRouter = require("../modules/campaign/campaign.router");

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/campaign', campaignRouter);

module.exports = router;