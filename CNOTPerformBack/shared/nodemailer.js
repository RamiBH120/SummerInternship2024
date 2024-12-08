const nodemailer = require("nodemailer");

const nodeMailer = async (user, pass, to, subject, text, attachment, res) => {
  
  const domain = user.substring(user.lastIndexOf('@')+1);
  let transporter;
  const attachements = [];

  if(attachment){
    attachements.push({
      filename : attachment.originalname,
      path : attachment.path,
    });
  }


  if (domain === 'gmail.com') {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // Use `true` for port 465, `false` for all other ports
      auth: {
        user: user,
        pass: pass,
      },
    });
  }

  if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
    transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      auth: {
        user: user,
        pass: pass
      }
    });
  }

  const message = {
    from: user,
    to: to,
    subject: subject,
    html: text,
    attachments:attachements
  };

  try {
    const info = await transporter.sendMail(message);
    if(res){
    res.status(200).json({ message: "Mail sent successfully" });
    }
  } catch (err) {
    console.error("Error occurred:", err);
    if(res){
    res.status(500).json({ error: err.message });
    }
  }
};

module.exports = nodeMailer;