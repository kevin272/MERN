const bcrypt = require('bcryptjs');
const mailService = require('../../services/mail.service');
const { randomStringGenerator } = require('../../utils/helper');
const userService= require('../user/user.service');
const { statusType } = require('../../config/constants.config');
const jwt = require ('jsonwebtoken')

class AuthController{

    loginUser = async (req,res,next)=>{

        try {
            const {email,password} =  req.body;
                console.log(email,password);
            // access user 
            const user = await userService.getSingleUserByFilter({email})
                console.log(user);
            if (bcrypt.compareSync(password,user.password)==true) {
                if(user.status==statusType.ACTIVE){
                    const token = jwt.sign({sub:user._id}
                    ,process.env.JWT_SECRET,
                    // {expiresIn:'1 day',algorithm:}
                      );

                      res.json({
                        result:{
                            userDetail:{
                                _id:user._id,
                               name:user.name,
                               email:user.email,
                               role:user.role,  
                            },
                            token
                            },
                            message:"Login Success",
                            meta:null
                        });
                      }
                else{
                    throw {statusCode:422,message:`Your account has not been activated yet`}
                }
            } else {
                throw {statusCode:422,message:`Credentials do not match`}
            }
        } catch (exception) {
            console.log(exception)
            next(exception);
        }
    }

    registerUser = async (req,res,next)=>{

        try {
        
        
        // data transformation
         const data = userService.transformUserCreate(req);

         console.log(data);
         //Database store
           const user = await userService.createUser(data)
        
        //  sending mail service
        
        await userService.sendActivationEmail(data);
        
        
        // sending response
        res.status(200).json ({
            result: user,
            message:"User Created Successfully",
            meta: null
        })
            } catch (error) {
                console.log(error)
                next(error);
            }
        
        }
    getUser =   async (req,res,next)=>{
        try {
           
            
        } catch (exception) {
            console.log(exception);
            next(exception);
        }
    }

    activateUser = async (req,res,next)=>{
        try {
            const {activationToken} = req.params;
            if (activationToken.length !== 20){
               throw {statusCode: 422, message: 'Invalid activationToken'}
            }
             const user =  await  userService.getSingleUserByFilter({activationToken});
            
            const today = Date.now();
            const activateFor = user.activatedFor.getTime();

            if (today > activateFor){
                throw {statusCode: 422, message: 'Token Expired'}
            }
            user.activationToken = null;
            user.activatedFor = null;
            user.status = statusType.ACTIVE;
            await user.save();   //insert or update

            res.json({
                result: null,
                message: 'User activated successfully. Please login to continue.',
                meta: null
            })


        } catch (exception) {
            console.log(exception)
        }
    }

resendActivationToken = async (req,res,next)=>{
    try {
        const {token} = req.params;
        const user = await userService.getSingleUserByFilter({token});

         user = userService.generateUserActivationToken(user);

         await user.save();  //insert or update
        await userService.sendActivationEmail({
            email: user.email,
            activationToken: user.activationToken,
            name: user.name,
            sub: 'User activation token'
        });

        res.json({
            result: null,
            message: 'Activation token sent successfully',
            meta: null
        });



    } catch (exception) {
      next(exception);
    }
}

refreshToken = async (req,res,next)=>{
    try {
        const token = req.headers['authorization'] || null;
        if(!token){
            throw {statusCode: 401, message: 'Token required'}
        }
        token = token.split(' ')[1];
        const {sub,type} = jwt.verify(token,process.env.JWT_SECRET);

        if(!type || type !== 'refresh'){
            throw {statusCode: 401, message: 'Refresh token required'}
        }

        await userService.getSingleUserByFilter({_id:sub});

        const accessToken = jwt.sign({sub},process.env.JWT_SECRET,{expiresIn:'1 day'});
        
        const refreshToken = jwt.sign({sub,type:'refresh'},process.env.JWT_SECRET,{expiresIn:'1 day'});
        
        res.json({
            result:{
                token :accessToken,
                refreshToken:refreshToken,
            },
            message:'Token refreshed successfully',
            meta:null
        })
    } catch (exception) {
        console.log(exception);
        next(exception);
    }
}

}

//  create an instance of the controller
const authcontroller = new AuthController();



//  exporting the authcontroller object
module.exports = authcontroller