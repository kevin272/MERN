const router = require('express').Router();


// import routes
const userRouter = require("../modules/user/user.router");
const authRouter = require("../modules/auth/auth.router");


router.use('/auth', authRouter);
router.use('/user', userRouter);


module.exports = router;