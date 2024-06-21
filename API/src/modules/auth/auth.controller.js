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

    activateUser = async (req,res,next)=>{
        try {
            const {activationToken} = req.params;
            if (activationToken.length !== 20){
               throw {statusCode: 422, message: 'Invalid activationToken'}
            }else{
              await  userService.getSingleUserByFilter({activationToken})
            }
        } catch (exception) {
            console.log(exception)
        }
    }



}

//  create an instance of the controller
const authcontroller = new AuthController();



//  exporting the authcontroller object
module.exports = authcontroller