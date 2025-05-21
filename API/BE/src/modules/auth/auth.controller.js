require('dotenv').config();
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

            if (!user) { // Added check for user existence
                throw {statusCode: 404, message: "User not found with this email."};
            }

            if (bcrypt.compareSync(password,user.password)==true) {
                if(user.status==statusType.ACTIVE){
                    // Generate access token
                    const accessToken = jwt.sign({sub:user._id}, process.env.JWT_SECRET, {expiresIn:'1d'}); // 1 day expiration
                    
                    // Generate refresh token
                    const refreshToken = jwt.sign({sub:user._id, type:'refresh'}, process.env.JWT_SECRET, {expiresIn:'7d'}); // Longer expiration for refresh token

                    res.json({
                        // *** ADJUSTED RESPONSE STRUCTURE TO MATCH FRONTEND EXPECTATION ***
                        userDetail:{
                            _id:user._id,
                           name:user.name,
                           email:user.email,
                           role:user.role,  
                        },
                        token: accessToken, // Frontend expects 'token' directly
                        refreshToken: refreshToken, // Frontend expects 'refreshToken'
                        message:"Login Success",
                        meta:null
                    });
                } else {
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
            // sending mail service
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

    getUser = async (req,res,next)=>{
        try {
            // Assuming req.authUser is set by loginCheck middleware
            // and contains the user details from the token
            if (!req.authUser || !req.authUser.id) {
                throw { statusCode: 401, message: "Unauthorized: User not logged in." };
            }
            const user = await userService.getSingleUserByFilter({ _id: req.authUser.id });
            if (!user) {
                throw { statusCode: 404, message: "User not found." };
            }
            res.json({
                data: { // Return user details in 'data' property
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    // Add any other user details you want to expose to the frontend
                },
                message: "User details fetched successfully",
                meta: null
            });
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
            const {token} = req.params; // Assuming this token is an email or user ID to find the user
            const user = await userService.getSingleUserByFilter({token}); // Adjust filter as needed

            // Regenerate activation token and update user
            user = userService.generateUserActivationToken(user); // Assuming this function exists and updates the user object

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
            let token = req.headers['authorization'] || null; // Use `let` because you reassign it
            if(!token){
                throw {statusCode: 401, message: 'Token required'}
            }
            token = token.split(' ')[1];
            const {sub,type} = jwt.verify(token,process.env.JWT_SECRET);

            if(!type || type !== 'refresh'){
                throw {statusCode: 401, message: 'Refresh token required'}
            }

            // Verify user exists and is active
            const user = await userService.getSingleUserByFilter({_id:sub});
            if (!user || user.status !== statusType.ACTIVE) {
                throw { statusCode: 401, message: 'Invalid or inactive user for refresh token' };
            }

            const accessToken = jwt.sign({sub: user._id},process.env.JWT_SECRET,{expiresIn:'1d'}); // Consistent expiration
            const newRefreshToken = jwt.sign({sub: user._id, type:'refresh'},process.env.JWT_SECRET,{expiresIn:'7d'}); // Consistent expiration
            
            res.json({
                result:{
                    token :accessToken,
                    refreshToken:newRefreshToken, // Send the new refresh token
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
module.exports = authcontroller;