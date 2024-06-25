const { hasPermission } = require('../../middlewares/rbac.miiddleware');
const { uploadFile } = require('../../middlewares/uploader.middleware');
const authcontroller = require('./auth.controller');
const {setPath} = require('../../middlewares/uploader.middleware');
const { loginCheck } = require('../../middlewares/auth.middleware');
const {bodyValidator} = require('../../middlewares/validator.middleware');
const { LoginDTO } = require('./auth.request');


const authRouter = require('express').Router();


//register user route
authRouter.post('/register',setPath(`user`),uploadFile().single('profile'),authcontroller.registerUser)


authRouter.post('/login',bodyValidator(LoginDTO),authcontroller.loginUser);

authRouter.get('/me',loginCheck,authcontroller.getUser);



authRouter.get('/activate/:token',authcontroller.activateUser);

authRouter.get('/resend-activation-token/:token ',hasPermission(['admin','seller']),authcontroller.resendActivationToken)

authRouter.get('/refresh-token',authcontroller.refreshToken)




module.exports = authRouter
;