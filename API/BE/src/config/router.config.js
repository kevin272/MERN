// router.config.js
const router = require('express').Router();

// import routes
const userRouter = require("../modules/user/user.router");
const authRouter = require("../modules/auth/auth.router");
const campaignRouter = require("../modules/campaign/campaign.router");
const chatRouter = require("../modules/chat/chat.router"); // Import the chat router

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/campaign', campaignRouter);
router.use('/chat', chatRouter); // Mount the chat router with a base path of '/chat'

module.exports = router;