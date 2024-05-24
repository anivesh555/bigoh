const { json } = require("express");
const nodemailer = require("nodemailer");

const sendEmail = async (emailData) => {
  
    try {
        let mailData = {
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: true,
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASSWORD,
            },
          }
          console.log(mailData)
      // Create a SMTP transporter object
      const transporter = await nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
      
      // Message object
      const message = {
        from: process.env.USER,
        to: "abhadauriya.8445@gmail.com",
        cc: "abhadauriya.8475@gmail.com",
        subject: "Status of Application",
        text: emailData,
      };
      console.log(message,"==>")
      let info = await transporter.sendMail(message);
      console.log("Message sent: %s", info.messageId);
      return true

    } catch (error) {
      return false
    }
  };
module.exports = {sendEmail}

// if(status){
//     userData = await User.findById(_userId)

//     const message = {
//       from: process.env.USER,
//       to: userData.email,
//       subject:"Order Update",
//       text: status,
//       // attachments: attachments,
//     };
//     emailRes = await sendEmail(message)
//     if(!emailRes){
//       throw {
//         message: constants.emailStatus,
//         code: constants.HTTP_404_CODE,
//       };
//     }
//     }