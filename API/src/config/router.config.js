const router = require ("express").Router();
const authRouter = require ("../modules/auth/auth.router")
const userRouter = require ("../modules/user/user.router")
router.use('/auth',authRouter)
router.use('/user',userRouter)

module.exports = router;