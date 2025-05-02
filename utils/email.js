const nodemailer = require("nodemailer");

exports.mailSender = async(email , title , body) => {
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        let info = await transporter.sendMail({
            from: "Auth App System by Yuvii..",
            to: `${email}`,
            subject: `${title}`,
            text: `${body}`,
        });

        console.log(info);
        console.log("Email sent successfully to " + email);
        return info;
        
    } catch (error) {
        console.error("Error sending email:", error);
    }
}
