const bcrypt = require('bcryptjs');
const mailService = require('../../services/mail.service');
const { randomStringGenerator } = require('../../utils/helper');
const userService = require('./user.service');


class UserController{
//    get all users 
 userLists = (req,res,next)=>{
    res.status(200).json({
        result: null,
        message: 'Get all users',
        meta: null
    });
 }
// create a new user
userCreate = async (req,res,next)=>{

try {


// data transformation
 const data = userService.transformUserCreate(req);
 
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
        next(error);
    }

}

/**
 * This function is used to get a user by id
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @returns {Promise<void>}
 */
userDetailById = (req,res,next)=>{
    const id = req.params.id;
   res.status(200).json({
       result: id,
       message: 'Get user by id',
       meta: null
   });
}   

// update user profile by id
userUpdate = (req,res,next)=>{
    const id = req.params.id;
    const data = req.body;
   res.status(200).json({
       result: id,
       message: 'Update user by id',
       meta: null
   });
}

// remove user by id
userRemove = (req,res,next)=>{
    const id = req.params.id;
    res.status(200).json({
         result: id,
         message: 'Remove user by id',
         meta: null
})
}
}

//  create an instance of the controller
const userController = new UserController();



//  exporting the userController object
module.exports = userController