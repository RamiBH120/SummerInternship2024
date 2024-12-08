const express = require('express');
const router = express.Router();
const mail = require('../models/mail');
const fetchemails = require('../shared/imap');
const mailaccount = require('../models/mailaccount');
const nodeMailer = require('../shared/nodemailer');
const upload = require('../shared/multer');
const { mailStatus } = require('../shared/enum');
const Imap = require('imap');
const bcrypt = require('bcrypt');
const path = require('path');

router.get('/', async (req, res, next) => {
    const mails = await mail.find();
    res.json(mails);
})


router.post('/setupaccount', async (req, res, next) =>{
  try{
    let host = '';
    if(req.body.email && req.body.password){

    const domain = req.body.email.substring(req.body.email.lastIndexOf('@')+1);

    if (domain === 'gmail.com') {
        host =  'imap.gmail.com';
    }

    if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
        host = 'imap-mail.outlook.com';
    }


    let imap = new Imap({
      user: req.body.email,
      password: req.body.password,
      host: host,
      port: 993,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false
      }
    });
    imap.once('ready', async () => {
      imap.end();
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const Mailaccount = new mailaccount({
        mailaddress: req.body.email,
        password: hashedPassword,
        userId: req.body.userId
      });
      await Mailaccount.save();
      res.json({"message" : "Account added successfully", "status" : "success"});
    });
    
    imap.once('error', (err) => {
      console.error('Error connecting to the IMAP server:', err);
      res.json({"message" : "Please check your account credentials", "status": "failed"});
    });
    imap.connect();
  }
}catch(err){ 
  res.json(err);
}
})

router.get('/verifyaccountset/:id', async(req, res) =>{
  try{
  const account = await mailaccount.find({userId: req.params.id});
  res.json(account[0]);
  } catch (error){
    return res.status(404).json({ message: 'Account not found' });
  }
})

router.post('/fetchemails', async (req, res) => {
  fetchemails(req.body.mailaddress, req.body.password);  
  const mails = await mail.find({to : req.body.mailaddress});
  res.json(mails);
})

router.post('/send',upload.single('file') ,async (req, res) =>{
  
  nodeMailer(req.body.from, req.body.password, req.body.to, req.body.subject, req.body.body,req.file , res);
})

router.get('/getmailadress/:id', async (req, res, next) =>{
  try{
  const account = await mailaccount.find({userId: req.params.id});
  res.json({"adress" : account[0].mailaddress });
  }catch (error) {
    return res.status(500).json({ "error": "Internal server error", "status": "failure" });
  }
})

router.get('/verifpassword/:mailaccount/:password', async (req, res) =>{
  const account = await mailaccount.find({mailaddress : req.params.mailaccount});
  const response = bcrypt.compareSync(req.params.password,account[0].password);
  res.json(response);
})

router.put('/bookmark/:id', async (req, res) =>{
  try {
    const updatedMail = await mail.findByIdAndUpdate(req.params.id, {
      bookmarked: true
    });

    if (!updatedMail) {
      return res.json({ "error": "Mail not found", "status": "failure" });
    }

    return res.json({ "message": "Mail is bookmarked successfully", "status": "success" });
  } catch (error) {
    return res.json({ "error": "Internal server error", "status": "failure" });
  }
})

router.get('/fetchemail/:id', async (req, res) =>{
  const email = await mail.findById(req.params.id);
  await mail.findByIdAndUpdate(req.params.id,{
    status: mailStatus.seen
  });
  res.json(email);
})

router.delete('/deleteemail/:id', async (req, res) =>{
  try{
  await mail.findByIdAndDelete(req.params.id);
  res.json({"message" : "mail deleted successfully"});
  }catch(err){
  res.json({"message" : err.message});
  }
})

router.get('/download/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join('attachments', fileName);
  res.download(filePath, (err) => {
    if (err) {
      res.status(404).send('File not found');
    }
  });
});

module.exports = router;