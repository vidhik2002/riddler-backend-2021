
const nodemailer = require("nodemailer");

const emailtemplate = (username, i) => {
    
    try {
        const email = [
          "vidhik2002@gmail.com",
          "sourishgupta02@gmail.com",
          "mannang6@gmail.com",
          "sanjaybaskaran01@gmail.com",
          "shivanshsharma2012@gmail.com",
        ];
        // const email = req.body.email?.toString();
        // console.log(email);

        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            },
            //to enable localhost for now
            tls: {
                rejectUnauthorized: false
            }
        });
        
        let mailOptions = {
            from: '"CSI VIT" vidhi.csivit@gmail.com', // sender address
            to: email, // list of receivers
            subject: 'Email Confirmation', // Subject line
            text: `${username} has solved ${i} questions`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log("Message sent: %s", info.messageId);
                });    
            }catch (e) {
        return console.log(e);
        
    }
}

module.exports = emailtemplate