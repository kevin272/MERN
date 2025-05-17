const nodemailer = require('nodemailer');

class MailService{
    #transporter;

    constructor(){
        try {
            const config = {
                host: process.env.SMTP_HOST,
                port: process.env.SMTP_PORT,
                secure: false, // Use `true` for port 465, `false` for all other ports
                auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS,
                },
              }

              if(process.env.MAIL_SERVICE==='gmail'){
                config['service'] = 'gmail';
              }
            this.#transporter=nodemailer.createTransport(config);
        console.log('Mail server connected....');
        } catch (exception) {
            console.log(exception);
            console.log('Error connecting mail server....');
        }
    }

    sendMail = async ({to,sub,message,attachments=null}) => {
       try {
        
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: to,
            subject: sub,
            html: message,
           
          };

        //   check if attachments are present and add to mail options
            if(attachments){
                mailOptions[attachments] = attachments;
            }
          
          let info = await this.#transporter.sendMail(mailOptions);
          console.log('Message sent: %s', info.messageId);

       } catch (error) {
        
        console.log('Error sending mail....');
        console.log(error);
        throw{
            statusCode:500,
            message:'Error sending mail',
            detail:error
        
        }
       }
    }
}


// create object of mail service
const mailService = new MailService();

module.exports = mailService;