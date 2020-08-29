import * as nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
      host:'smtp.mailtrap.io',
      port:2525,
      secure: false, // true for 465, false for other ports
      auth: {
        user: '2b1d515b360e45', // generated ethereal user
        pass: 'c7b58fde86c411' // generated ethereal password
      }
    });
  
    // send mail with defined transport object
    const message = {
      from: 'noreply@devcamper.io',
      to: options.email,
      subject: options.subject,
      text: options.message
    };
  
    const info = await transporter.sendMail(message);
  
    console.log("Message sent: %s", info.messageId);
}
