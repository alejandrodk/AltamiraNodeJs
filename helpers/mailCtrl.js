import { createTransport, getTestMessageUrl } from 'nodemailer';

export default sendEmail = (emailData) => {
    const { receiver, subject, message } = emailData;

    async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        //let testAccount = await nodemailer.createTestAccount();
      
        // create reusable transporter object using the default SMTP transport
        let transporter = createTransport({
          host: "tigre.avnam.net",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: 'publicidad@altamiragroup.com.ar', //testAccount.user, // generated ethereal user
            pass: 'Altamira123456'//testAccount.pass // generated ethereal password
          }
        });
      
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: '"Altamira Group" <info@altamiragroup.com.ar>', // sender address
          to: receiver, // list of receivers
          replyTo: 'info@altamiragroup.com.ar',
          subject: subject, // Subject line
          text: message, // plain text body
          //html: "<b>Hello world?</b>" // html body
        });
      
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
      
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }
      
      main().catch(console.error);
}