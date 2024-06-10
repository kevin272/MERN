const bcrypt = require('bcryptjs');
const mailService = require('../../services/mail.service');
const { randomStringGenerator } = require('../../utils/helper');


class UserService {

transformUserCreate = (req)=>{
    const data = req.body;   // name , email, password,confirmpassword, address, phone



    // hash the password
    const salt = bcrypt.genSaltSync(10);
    data.password = bcrypt.hashSync(data.password,salt);
    // data.confirmpassword = bcrypt.hashSync(data.confirmpassword,salt);
    // if single files
    if(req.file)   // {}
        {
        data.image = req.file.filename;
    
    }
    
    // if multiple files
    if(req.files)    // [{},{},{}]
        {
        data.images = req.files.map(file => file.filename);
    }
    
    
    
    // send confirmation email and other verification process
    data.activateToken = randomStringGenerator(20);
    data.status = 'inactive';


    return data;
}

sendActivationEmail = async ({name,email,token})=>{
    try {
        await mailService.sendMail({
            to: "24.student.Tiwari@broadwayinfosys.edu.np@gmail.com",
            sub: 'User Created',
            message:`
            Dear ${data.name},<br>
            Your account has been created successfully. Please click the link below to activate your account.<br>
            <a href="${process.env.FRONTEND_URL}/activate/${data.activateToken}">Activate Now</a>
            <p>
            <small>This is an auto generated email. Please do not reply to this email.</small>
            </p>
            <p>
            Regards,<br>
            Team
            </p>
            `
        });
    } catch (error) {
        
        console.log(error);
        
    }
}

}


// object of userService class
const userService = new UserService();



module.exports = userService;